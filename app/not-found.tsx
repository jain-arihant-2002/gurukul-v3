import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4" >
      <h1 className="text-4xl inline-block align-center font-medium leading-[49px]">
        Page Not Found 
      </h1>
      <Link href="/">Return Home</Link>
    </div>
  )
}