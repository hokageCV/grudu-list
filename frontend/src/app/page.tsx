import About from '@/components/About';

export default function Home() {
  return (
    <main>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <About/>
          </div>
        </div>
      </div>
    </main>
  );
}
