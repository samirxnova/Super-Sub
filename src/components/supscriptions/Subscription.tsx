import { Popover, Transition } from '@headlessui/react'
import { SignalIcon } from '@heroicons/react/24/outline'
import { Framework } from '@superfluid-finance/sdk-core'
import { useEthersAppContext } from 'eth-hooks/context'
import { Signer } from 'ethers'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { BsArrowRepeat, BsPauseFill, BsThreeDotsVertical } from 'react-icons/bs'
import { EMOJIS, FLOW_RATES, SSAJson } from '~~/helpers/constants'
import { generateEvmContractConditions } from '~~/helpers/generateEvmContractConditions'
import { getJWTResourceId } from '~~/helpers/getJWTResourceId'
import { getSigningMsg } from '~~/helpers/getSigningMsg'
import { useLitClient } from '~~/hooks/useLitClient'
import { useAppDispatch } from '~~/redux/hooks'
import { pauseSub, TSubscription } from '~~/redux/slices/subs'
import { ClipString } from '../ClipString'
import FlowingBalance from '../FlowingBalance'
import ProgressBar from '../Progressbar'
import { ShortAddress } from '../ShortAddress'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

interface SubscriptionProps {
  subscriptions: TSubscription
}

export const Subscription: React.FC<SubscriptionProps> = ({ subscriptions: sub }) => {
  // const [txMessage, setTxMessage] = useState<string>('')
  const [unlocking, setUnlocking] = useState<boolean>(false)
  const [pausing, setPausing] = useState<boolean>(false)

  const monthlyDAI = FLOW_RATES[sub.address].find((flowRate) => flowRate.value === sub.flowRate)?.rate || '?'

  const client = useLitClient()
  const context = useEthersAppContext()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const pauseFlow = async () => {
    try {
      setPausing(true)
      const sf = await Framework.create({
        chainId: 80001,
        provider: context.provider,
      })

      const DAIxContract = await sf.loadSuperToken('fDAIx')
      const DAIx = DAIxContract.address

      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: context.account as string,
        receiver: sub.address,
        flowRate: sub.flowRate,
        superToken: DAIx,
      })

      const result = await deleteFlowOperation.exec(context.signer as Signer)

      const recipe = await context.provider?.waitForTransaction(result.hash)
      if (recipe?.status === 0) {
        // setTxMessage('❌🥪 Failed!')
      } else {
        // setTxMessage('✅🥪 Paused!')
        dispatch(pauseSub({ address: sub.address, balance: sub.passBalance }))
        // setTimeout(function () {
        //   setTxMessage('')
        // }, 4000)
      }

      // setTimeout(function () {
      //   setTxMessage('')
      // }, 4000)
    } catch (error: any) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      )
      console.error(error)

      // if (error.code === 4001) {
      //   setTxMessage('❌🥪 Cancelled')
      // } else {
      //   setTxMessage('An error occured')
      // }

      // setTimeout(function () {
      //   setTxMessage('')
      // }, 4000)
    } finally {
      setPausing(false)
    }
  }

  const unlockSubstation = async () => {
    const resourceId = getJWTResourceId(sub.address)

    console.log(sub.address, 'sub.address')
    console.log(SSAJson.address, 'SSAJson.address')

    if (!client) {
      console.log('no client')
      return
    }

    try {
      setUnlocking(true)

      const msg = getSigningMsg(context.account!, context.chainId!)
      const sig = await context.signer?.signMessage(msg)
      const authSig = {
        sig: sig,
        derivedVia: 'web3.eth.personal.sign',
        signedMessage: msg,
        address: context.account,
      }

      const jwt = (await client.getSignedToken({
        evmContractConditions: generateEvmContractConditions(sub.address, 'mumbai', 0),
        chain: 'mumbai',
        authSig,
        resourceId: resourceId,
      })) as string
      Cookies.set('lit-auth', jwt, { expires: 1 })

      await router.push(`/substation?sub=${sub.address}`)
    } catch (err: any) {
      setUnlocking(false)
      console.log('error: ', err.message)
    }
  }

  const drawActiveSubElements = () => (
    <>
      <button
        onClick={() => unlockSubstation()}
        disabled={unlocking}
        className="inline-flex items-center cursor-pointer shadow shadow-green-400 my-24 px-6 py-3 border transition-colors border-transparent text-base font-medium rounded-full text-gry-800 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        {unlocking ? (
          <>
            <AiOutlineLoading className="w-8 h-8 mr-2 animate-spin" /> <div>Unlocking...</div>
          </>
        ) : (
          <>
            <SignalIcon className="w-8 h-8 mr-2" />{' '}
            <div className="uppercase tracking-widest select-none">Open Substation</div>
          </>
        )}
      </button>

      <div className="flex flex-col items-start space-y-1 ml-8 cursor-default select-none">
        <div className="font-semibold tracking-widest text-gray-300">{monthlyDAI} DAI per month</div>
        <div className="font-semibold tracking-widest">DAI Until next Tier:</div>
        <div className="relative text-2xl w-72 text-left tracking-widest font-semibold text-green-400">
          <FlowingBalance
            balance={sub.toNextTier}
            balanceTimestamp={Number(sub.balanceTimestamp)}
            flowRate={sub.flowRate}
            reverse={true}
          />
          <div className="absolute inset-y-0 w-12 right-0 bg-gradient-to-r from-transparent via-gray-50 to-gray-50" />
        </div>
      </div>
    </>
  )

  const drawInactiveSubElements = () => (
    <div className="flex flex-col items-center my-24 space-y-8">
      <div className="uppercase text-3xl font-bold tracking-widest text-gray-400">inactive</div>
      <Link href={`/subscribe?sub=${sub.address}&reactivate=true`}>
        <a className="inline-flex items-center cursor-pointer px-6 py-3 border transition-colors border-transparent text-base font-medium rounded-full shadow-sm text-gray-800 hover:text-green-400 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <BsArrowRepeat className="w-8 h-8 mr-2" />
          <div className="flex items-center"> Re-Activate </div>
        </a>
      </Link>
    </div>
  )

  return (
    <div className="group relative w-72 flex-none h-full flex flex-col items-center justify-start bg-gray-50 pt-16 pb-8 px-4 rounded-xl shadow-md overflow-hidden">
      <div className="absolute -top-4 text-9xl transform scale-[3] -rotate-12 opacity-10 pointer-events-none">
        {EMOJIS[sub.address]}
      </div>
      <a
        href={`https://mumbai.polygonscan.com/address/${sub.address}`}
        target="_blank"
        className="absolute top-2 left-4 text-gray-400 hover:text-gray-800 tracking-wider cursor-pointer"
        rel="noreferrer">
        <ShortAddress address={sub.address} />
      </a>

      {sub.active && (
        <Popover className="absolute top-0 right-0">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open ? 'text-gray-900' : 'text-gray-500',
                  'relative flex items-center cursor-pointer justify-center w-10 h-10 rounded-full bg-white bg-opacity-25 border-0 hover:text-gray-900 focus:outline-none'
                )}>
                <BsThreeDotsVertical
                  className={classNames(open ? 'text-gray-600' : 'text-gray-400', 'h-6 w-6 group-hover:text-gray-500')}
                  aria-hidden="true"
                />
                {pausing && <AiOutlineLoading className="absolute w-6 h-6 -left-6 animate-spin" />}
              </Popover.Button>

              {/* @ts-ignore */}
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1">
                <Popover.Panel className="absolute -left-8 z-20 -translate-x-1/2 transform px-2 sm:px-0">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => pauseFlow()}
                      disabled={pausing}
                      className="flex items-center cursor-pointer transition space-x-2 px-2 py-2 bg-white text-gray-800 border-0 duration-150 ease-in-out hover:bg-gray-50">
                      {pausing ? (
                        <>
                          <AiOutlineLoading className="w-6 h-6 animate-spin" />
                          <div className="text-base font-medium whitespace-nowrap">pausing ...</div>
                        </>
                      ) : (
                        <>
                          <BsPauseFill className="text-gray-800 text-xl" />
                          <div className="text-base font-medium whitespace-nowrap">pause sub</div>
                        </>
                      )}
                    </button>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      )}

      <div className="flex flex-col items-center space-y-16 cursor- select-none z-10">
        <div className="text-3xl text-center w-min uppercase tracking-widest font-bold">
          <ClipString maxLength={15} text={sub.name} />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="tracking-widest font-bold text-gray-600">Tier</div>
          <div className="text-5xl relative uppercase font-bold bg-white rounded-full h-24 w-24 flex items-center justify-center pb-1 shadow-md shadow-green-400">
            {sub.tier === sub.availableTiers.length - 1 ? <div className="text-green-400">MAX</div> : sub.tier + 1}
          </div>
        </div>
      </div>

      {sub.active ? drawActiveSubElements() : drawInactiveSubElements()}

      <div className="absolute bottom-0 w-full">
        <ProgressBar
          fromBalance={sub.tier < sub.availableTiers.length ? sub.availableTiers[sub.tier] : sub.availableTiers[-1]}
          toNextTier={sub.toNextTier}
          balance={sub.passBalance}
          balanceTimestamp={Number(sub.balanceTimestamp)}
          flowRate={sub.flowRate}
        />
      </div>
    </div>
  )
}
