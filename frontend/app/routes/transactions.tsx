import { useLingui } from '@lingui/react/macro'
import { useState } from 'react'
import { TransactionForm } from '~/components/forms'
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

	const handleDelete = async (id: number) => {
		if (confirm(t`Are you sure you want to delete this transaction?`)) {
			await deleteTransaction(id)
		}
	}

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
				<TransactionForm categories={categories} onSubmit={createTransaction} onCancel={() => setShowForm(false)} />
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
