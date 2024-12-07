import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <h2 className='text-zinc-400'>This page does not exist!</h2>
      <p>Could not find requested resource!</p>
      <Link className="text-blue-500 underline" href="/">Return Home</Link>
    </div>
  )
}