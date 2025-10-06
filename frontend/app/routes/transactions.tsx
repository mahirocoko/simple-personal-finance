import { useLingui } from '@lingui/react/macro'
import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'

export default function Transactions() {
	const { t } = useLingui()
	const currentMonth = new Date().toISOString().slice(0, 7)
	const [selectedMonth, setSelectedMonth] = useState(currentMonth)
	const { transactions, loading, error, createTransaction, deleteTransaction } = useTransactions({
		month: selectedMonth,
	})
	const { categories } = useCategories()

	const [showForm, setShowForm] = useState(false)
	const [formData, setFormData] = useState({
		amount: '',
		type: 'expense' as 'income' | 'expense',
		category_id: '',
		description: '',
		date: new Date().toISOString().split('T')[0],
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const result = await createTransaction({
			amount: Number.parseFloat(formData.amount),
			type: formData.type,
			category_id: Number.parseInt(formData.category_id),
			description: formData.description,
			date: formData.date,
		})

		if (result.success) {
			setShowForm(false)
			setFormData({
				amount: '',
				type: 'expense',
				category_id: '',
				description: '',
				date: new Date().toISOString().split('T')[0],
			})
		}
	}

	const handleDelete = async (id: number) => {
		if (confirm(t`Are you sure you want to delete this transaction?`)) {
			await deleteTransaction(id)
		}
	}

	const availableCategories = categories.filter((cat) => cat.type === formData.type)

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">{t`Transactions`}</h1>
				<button
					onClick={() => setShowForm(!showForm)}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					{showForm ? t`Cancel` : t`+ Add Transaction`}
				</button>
			</div>

			{/* Filter */}
			<div className="mb-4">
				<label className="block mb-2 font-semibold">{t`Select Month`}:</label>
				<input
					type="month"
					value={selectedMonth}
					onChange={(e) => setSelectedMonth(e.target.value)}
					className="border p-2 rounded"
				/>
			</div>

			{/* Form */}
			{showForm && (
				<form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg mb-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block mb-2 font-semibold">{t`Type`}</label>
							<select
								value={formData.type}
								onChange={(e) =>
									setFormData({
										...formData,
										type: e.target.value as 'income' | 'expense',
										category_id: '',
									})
								}
								className="border p-2 rounded w-full"
								required
							>
								<option value="expense">{t`Expense`}</option>
								<option value="income">{t`Income`}</option>
							</select>
						</div>

						<div>
							<label className="block mb-2 font-semibold">{t`Amount`}</label>
							<input
								type="number"
								step="0.01"
								value={formData.amount}
								onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
								className="border p-2 rounded w-full"
								required
								min="0.01"
							/>
						</div>

						<div>
							<label className="block mb-2 font-semibold">{t`Category`}</label>
							<select
								value={formData.category_id}
								onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
								className="border p-2 rounded w-full"
								required
							>
								<option value="">{t`Select Category`}</option>
								{availableCategories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.icon} {cat.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block mb-2 font-semibold">{t`Date`}</label>
							<input
								type="date"
								value={formData.date}
								onChange={(e) => setFormData({ ...formData, date: e.target.value })}
								className="border p-2 rounded w-full"
								required
							/>
						</div>
					</div>

					<div>
						<label className="block mb-2 font-semibold">{t`Note`}</label>
						<textarea
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							className="border p-2 rounded w-full"
							rows={2}
						/>
					</div>

					<button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
						{t`Save`}
					</button>
				</form>
			)}

			{/* List */}
			{loading ? (
				<p>{t`Loading...`}</p>
			) : error ? (
				<p className="text-red-500">
					{t`Error`}: {error}
				</p>
			) : transactions.length === 0 ? (
				<p className="text-gray-500">{t`No transactions this month`}</p>
			) : (
				<div className="space-y-2">
					{transactions.map((tx) => (
						<div key={tx.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
							<div className="flex items-center gap-3">
								<span className="text-2xl">{tx.category_icon}</span>
								<div>
									<p className="font-semibold">{tx.category_name}</p>
									<p className="text-sm text-gray-500">
										{tx.description || '-'} • {tx.date}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<p className={`text-xl font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
									{tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
								</p>
								<button onClick={() => handleDelete(tx.id)} className="text-red-500 hover:text-red-700">
									{t`Delete`}
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
