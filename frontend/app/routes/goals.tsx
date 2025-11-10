import { useLingui } from '@lingui/react/macro'
import { useState } from 'react'
import { GoalForm } from '~/components/forms'
import { useGoals } from '../hooks/use-goals'

export default function Goals() {
  const { t } = useLingui()
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } = useGoals()
  const [showForm, setShowForm] = useState(false)

  const handleAddProgress = async (goalId: number, currentAmount: number) => {
    const amount = prompt(t`Add amount:`)
    if (amount) {
      const newAmount = currentAmount + Number.parseFloat(amount)
      await updateGoal(goalId, { current_amount: newAmount })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm(t`Are you sure you want to delete this goal?`)) {
      await deleteGoal(id)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t`Savings Goals`}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? t`Cancel` : t`+ Add Goal`}
        </button>
      </div>

      {/* Form */}
      {showForm && <GoalForm onSubmit={createGoal} onCancel={() => setShowForm(false)} />}

      {/* List */}
      {loading ? (
        <p>{t`Loading...`}</p>
      ) : error ? (
        <p className="text-red-500">
          {t`Error`}: {error}
        </p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500">{t`No goals yet`}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = goal.progress_percentage || 0
            const isCompleted = progress >= 100

            return (
              <div key={goal.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{goal.name}</h3>
                  <button onClick={() => handleDelete(goal.id)} className="text-red-500 hover:text-red-700 text-sm">
                    {t`Delete`}
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      ฿{goal.current_amount.toLocaleString()} / ฿{goal.target_amount.toLocaleString()}
                    </span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {goal.deadline && (
                      <p>
                        {t`Deadline`}: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <p>
                      {t`Remaining`}: ฿{(goal.remaining_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() => handleAddProgress(goal.id, goal.current_amount)}
                      className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      {t`+ Add Savings`}
                    </button>
                  )}
                  {isCompleted && <span className="text-green-600 font-bold">{t`✓ Completed!`}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
