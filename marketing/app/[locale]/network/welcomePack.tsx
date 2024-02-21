'use client'

import fetch from 'fetch-plus-plus'
import { useLocale, useTranslations } from 'next-intl'
import { useReCaptcha } from 'next-recaptcha-v3'
import { FormEvent, useState } from 'react'
import { Button } from 'ui-common/components/button'
import { useMutation } from 'wagmi'

const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const giveAwayTokens = [
  {
    amount: 200,
    icon: (
      // https://github.com/BVM-priv/ui-monorepo/issues/63
      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-red-400 to-indigo-500" />
    ),
    symbol: 'HEMI',
  },
  {
    amount: 0.0012,
    icon: (
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
          fill="#F7931A"
        />
        <path
          d="M17.392 10.515C17.6275 8.943 16.4298 8.09775 14.7933 7.53375L15.3243 5.40375L14.0283 5.08125L13.5108 7.155C13.1703 7.0695 12.8208 6.99 12.472 6.9105L12.9933 4.82325L11.6973 4.5L11.1663 6.62925C10.8843 6.56475 10.6068 6.50175 10.3383 6.43425L10.3398 6.4275L8.55179 5.98125L8.20679 7.36575C8.20679 7.36575 9.16904 7.58625 9.14879 7.59975C9.67379 7.731 9.76829 8.07825 9.75254 8.35425L9.14804 10.7805C9.18404 10.7895 9.23054 10.803 9.28304 10.8232L9.14579 10.7895L8.29829 14.1885C8.23379 14.3475 8.07104 14.5867 7.70354 14.496C7.71704 14.5147 6.76154 14.2612 6.76154 14.2612L6.11804 15.7448L7.80554 16.1655C8.11904 16.2443 8.42654 16.3267 8.72879 16.404L8.19254 18.558L9.48779 18.8805L10.0188 16.7505C10.3728 16.8457 10.7163 16.9342 11.0523 17.0182L10.5228 19.1392L11.8188 19.4618L12.355 17.3123C14.566 17.7308 16.228 17.562 16.9278 15.5625C17.4918 13.953 16.9 13.0238 15.7368 12.4185C16.5843 12.2235 17.2218 11.6663 17.392 10.515ZM14.4295 14.6685C14.0298 16.2788 11.3185 15.408 10.4395 15.1898L11.152 12.336C12.031 12.5557 14.8488 12.99 14.4295 14.6685ZM14.8308 10.4918C14.4655 11.9565 12.2095 11.2118 11.4783 11.0295L12.1233 8.442C12.8545 8.62425 15.2118 8.964 14.8308 10.4918Z"
          fill="white"
        />
      </svg>
    ),
    symbol: 'sBTC',
  },
]

const CoinRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-x-2 py-3 text-sm ">
    {icon}
    <p>{text}</p>
  </div>
)

const EmailIcon = () => (
  <svg fill="none" height={25} width={24} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 4.542H3a.75.75 0 0 0-.75.75v12.75a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.292a.75.75 0 0 0-.75-.75Zm-9 7.983L4.928 6.042h14.144L12 12.525Zm-2.746-.483L3.75 17.087V6.997l5.504 5.045Zm1.11 1.017 1.125 1.036a.75.75 0 0 0 1.014 0l1.125-1.036 5.438 4.983H4.928l5.436-4.983Zm4.382-1.017 5.504-5.045v10.09l-5.504-5.045Z"
      fill="gray"
    />
  </svg>
)

const ErrorIcon = () => (
  <svg height={61} width={61} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30.469 0C47.297 0 60.94 13.64 60.94 30.469c0 16.828-13.644 30.472-30.472 30.472C13.64 60.941 0 47.297 0 30.47 0 13.64 13.64 0 30.469 0Zm5.957 19.418a3.476 3.476 0 0 1 4.953-.016 3.564 3.564 0 0 1 .016 5l-5.985 6.07 5.988 6.075c1.356 1.375 1.332 3.598-.039 4.973-1.375 1.37-3.586 1.367-4.937-.008l-5.95-6.032-5.96 6.043a3.47 3.47 0 0 1-4.95.012 3.56 3.56 0 0 1-.015-5l5.984-6.066-5.988-6.078c-1.355-1.371-1.336-3.598.039-4.97 1.375-1.37 3.586-1.366 4.938.009l5.949 6.03Zm0 0"
      fill="#ff4141"
      fillOpacity={1}
      fillRule="evenodd"
      stroke="none"
    />
  </svg>
)

const SuccessIcon = () => (
  <svg fill="none" height={61} width={61} xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M30.501 55.042c13.807 0 25-11.192 25-25 0-13.807-11.193-25-25-25s-25 11.193-25 25c0 13.808 11.193 25 25 25Zm11.48-31.348a1.875 1.875 0 0 0-2.96-2.303l-10.018 12.88a.625.625 0 0 1-.911.08l-6.337-5.702a1.875 1.875 0 0 0-2.508 2.787l6.336 5.703a4.375 4.375 0 0 0 6.38-.566l10.018-12.88Z"
      fill="#01AE33"
      fillRule="evenodd"
    />
  </svg>
)

const ResetIcon = () => (
  <svg fill="none" height={25} width={24} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 12.042a9 9 0 0 1-8.88 9H12a8.942 8.942 0 0 1-6.178-2.456.75.75 0 0 1 1.031-1.09 7.5 7.5 0 1 0-.18-10.738L4.18 9.042h2.57a.75.75 0 1 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 1 1 1.5 0v2.794l2.648-2.419A9 9 0 0 1 21 12.042Z"
      fill="gray"
    />
  </svg>
)

const PostClaimMessage = ({
  description,
  icon,
}: {
  icon: React.ReactNode
  description: React.ReactNode
}) => (
  <div className="mt-4 flex flex-col items-center justify-center gap-y-3 rounded-lg bg-zinc-50 p-6">
    {icon}
    {description}
  </div>
)

type EmailState = 'initial' | 'sent' | 'failed'

export const WelcomePack = function () {
  const locale = useLocale()
  const t = useTranslations()

  const { executeRecaptcha, loaded: recaptchaLoaded } = useReCaptcha()

  const [email, setEmail] = useState('')
  const [receiveUpdates, setReceiveUpdates] = useState(false)

  const [emailState, setEmailState] = useState<EmailState>('initial')

  const { isLoading: isClaiming, mutate: claimTokens } = useMutation<
    void,
    Error,
    { email: string; receiveUpdates: boolean }
  >({
    mutationFn: async function claimTokens(body) {
      const token = await executeRecaptcha('claim_tokens')

      return fetch(`${process.env.NEXT_PUBLIC_CLAIM_TOKENS_URL}/claim`, {
        body: JSON.stringify({
          ...body,
          token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    },
    onError() {
      setEmailState('failed')
    },
    onSuccess() {
      setEmailState('sent')
    },
  })

  const canClaim = !isClaiming && recaptchaLoaded && EmailRegex.test(email)

  const handleSubmit = function (e: FormEvent) {
    e.preventDefault()
    if (!canClaim) {
      return
    }
    claimTokens({ email, receiveUpdates })
  }

  const onTryAgain = function () {
    setEmailState('initial')
    setEmail('')
  }

  const linksCss =
    'cursor-pointer underline text-blue-600 hover:text-blue-800 visited:text-purple-600'

  return (
    <>
      <h4 className="w-full text-xl font-medium">
        {t('network.your-welcome-pack')}
      </h4>
      {emailState === 'initial' && (
        <>
          <p className="pt-3 text-sm text-neutral-400">
            {t('network.welcome-pack-description')}
          </p>
          {giveAwayTokens.map(({ amount, icon, symbol }) => (
            <CoinRow
              icon={icon}
              key={symbol}
              text={t('network.amount-of-tokens', {
                amount,
                symbol,
              })}
            />
          ))}
          <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-xl bg-zinc-50 px-7 py-4 text-sm font-medium text-black"
              onChange={e => setEmail(e.target.value)}
              placeholder="email@mail.com"
              type="email"
              value={email}
            />
            <div className="flex items-center gap-x-2">
              <input
                checked={receiveUpdates}
                className="cursor-pointer border-gray-300 bg-gray-100 text-green-600 accent-green-600 focus:ring-2 focus:ring-green-600"
                id="receive-updates-checkbox"
                onChange={e => setReceiveUpdates(e.target.checked)}
                placeholder={t('network.email-placeholder')}
                type="checkbox"
              />
              <label
                className="cursor-pointer text-xs text-zinc-500 "
                htmlFor="receive-updates-checkbox"
              >
                {t('network.receive-updates')}
              </label>
            </div>
            <Button disabled={!canClaim} type="submit">
              {t(isClaiming ? 'network.claiming' : 'network.claim-my-tokens')}
            </Button>
            <div className="text-xs text-neutral-400">
              {/* See https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed */}
              {t.rich('network.recaptcha-terms-and-conditions', {
                privacy: (chunk: string) => (
                  <a
                    className={linksCss}
                    href={`https://policies.google.com/privacy?hl=${locale}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {chunk}
                  </a>
                ),
                terms: (chunk: string) => (
                  <a
                    className={linksCss}
                    href={`https://policies.google.com/terms?hl=${locale}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {chunk}
                  </a>
                ),
              })}
            </div>
          </form>
        </>
      )}
      {emailState === 'sent' && (
        <PostClaimMessage
          description={
            <>
              <div className="flex items-center gap-x-2">
                <div className="min-w-6">
                  <EmailIcon />
                </div>
                <p className="text-xs text-black">
                  {t('network.magic-link-in-your-email')}
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="min-w-6">
                  <ResetIcon />
                </div>
                <p className="text-xs text-black">
                  {t.rich('network.did-not-receive-try-again', {
                    button: (chunk: string) => (
                      <button
                        className="font-semibold underline"
                        onClick={onTryAgain}
                      >
                        {chunk}
                      </button>
                    ),
                  })}
                </p>
              </div>
            </>
          }
          icon={<SuccessIcon />}
        />
      )}
      {emailState === 'failed' && (
        <PostClaimMessage
          description={
            <div className="flex items-center gap-x-2">
              <div className="min-w-6">
                <ResetIcon />
              </div>
              <p className="flex-shrink text-xs text-black">
                {t.rich('network.email-failed', {
                  button: (chunk: string) => (
                    <button
                      className="font-semibold underline"
                      onClick={onTryAgain}
                    >
                      {chunk}
                    </button>
                  ),
                })}
              </p>
            </div>
          }
          icon={<ErrorIcon />}
        />
      )}
    </>
  )
}
