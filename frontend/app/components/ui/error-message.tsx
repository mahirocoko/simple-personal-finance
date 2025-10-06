export interface IErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: IErrorMessageProps) {
  return <p className="text-red-500">Error: {message}</p>
}
