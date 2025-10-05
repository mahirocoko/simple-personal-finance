import { useState } from 'react'
import { useGoals } from '../hooks/useGoals'

export default function Goals() {
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } =
    useGoals()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '',
    deadline: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await createGoal({
      name: formData.name,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount) || 0,
      deadline: formData.deadline || undefined,
    })

    if (result.success) {
      setShowForm(false)
      setFormData({
        name: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
      })
    }
  }

  const handleAddProgress = async (goalId: number, currentAmount: number) => {
    const amount = prompt('เพิ่มจำนวนเงิน:')
    if (amount) {
      const newAmount = currentAmount + parseFloat(amount)
      await updateGoal(goalId, { current_amount: newAmount })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('ต้องการลบเป้าหมายนี้?')) {
      await deleteGoal(id)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">เป้าหมายการออม</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'ยกเลิก' : '+ เพิ่มเป้าหมาย'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-lg mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">ชื่อเป้าหมาย</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
                placeholder="เช่น ซื้อรถใหม่"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">เป้าหมาย (฿)</label>
              <input
                type="number"
                step="0.01"
                value={formData.target_amount}
                onChange={(e) =>
                  setFormData({ ...formData, target_amount: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
                min="0.01"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                ออมไปแล้ว (฿)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.current_amount}
                onChange={(e) =>
                  setFormData({ ...formData, current_amount: e.target.value })
                }
                className="border p-2 rounded w-full"
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                วันที่ครบกำหนด (ถ้ามี)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            สร้างเป้าหมาย
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีเป้าหมาย</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = goal.progress_percentage || 0
            const isCompleted = progress >= 100

            return (
              <div key={goal.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{goal.name}</h3>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ลบ
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      ฿{goal.current_amount.toLocaleString()} / ฿
                      {goal.target_amount.toLocaleString()}
                    </span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {goal.deadline && (
                      <p>ครบกำหนด: {new Date(goal.deadline).toLocaleDateString('th-TH')}</p>
                    )}
                    <p>
                      เหลือ: ฿{(goal.remaining_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() =>
                        handleAddProgress(goal.id, goal.current_amount)
                      }
                      className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      + เพิ่มเงินออม
                    </button>
                  )}
                  {isCompleted && (
                    <span className="text-green-600 font-bold">✓ สำเร็จแล้ว!</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
