import { auth } from '@/auth';
import PagePlaceholder from '@/components/page-placeholder';

export default async function Home() {
  const session = await auth();
  return (
    <div className="container mx-auto p-4">
      <PagePlaceholder pageName="Home" />
      <h2 className='text-2xl mt-4 ml-4'>
        Welcome Back: <span className='font-bold'>{session?.user?.name}</span>
      </h2>
    </div>
  )
}
