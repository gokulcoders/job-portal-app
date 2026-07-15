// Reusable button -> <Button onClick={...}>Save</Button>
export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
