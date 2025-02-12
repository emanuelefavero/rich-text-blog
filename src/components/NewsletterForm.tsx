import { subscribe } from '@/app/actions/subscribe'

export default function Component() {
  async function subscribeEmail(formData: FormData) {
    'use server'

    await subscribe(formData)
  }

  return (
    <div className='hidden select-none flex-col flex-wrap items-center justify-center gap-2 5xs:flex md:flex-row md:gap-3'>
      <h2 className='text-center text-lg uppercase'>
        Iscriviti alla Newsletter
      </h2>

      <form
        action={subscribeEmail}
        className='flex flex-wrap items-center justify-center gap-2'
      >
        <label htmlFor='email' className='sr-only text-base'>
          Email{' '}
          <sup className='select-none align-top text-lg font-bold text-pink-600 dark:text-pink-400'>
            *
          </sup>
        </label>
        <input type='email' name='email' placeholder='La tua email' />
        <button
          type='submit'
          className='rounded bg-pink-600 px-3 py-2 text-white hover:bg-pink-700 active:scale-95'
        >
          Iscriviti
        </button>
      </form>
    </div>
  )
}
