import HomePage from '../components/Home';

export default function Home() {
  return (
    <main>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <HomePage/>
          </div>
        </div>
      </div>
    </main>
  );
}
