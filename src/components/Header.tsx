import { getNetwork } from '@ethersproject/networks'
import { Alert, PageHeader } from 'antd'
import { Account } from 'eth-components/ant'
import {
  connectorErrorText,
  CouldNotActivateError,
  NoStaticJsonRPCProviderFoundError,
  useEthersAppContext,
  UserClosedModalError,
} from 'eth-hooks/context'
import { FC, ReactElement, ReactNode, useCallback } from 'react'

import { useAntNotification } from '~common/components/hooks'
import { IScaffoldAppProviders } from '~common/models'

// displays a page header
export interface IMainPageHeaderProps {
  scaffoldAppProviders: IScaffoldAppProviders
  children?: ReactNode
}

/**
 * ✏ Header: Edit the header and change the title to your project name.  Your account is on the right *
 * @param props
 * @returns
 */
export const Header: FC<IMainPageHeaderProps> = (props) => {
  // const settingsContext = useContext(EthComponentsSettingsContext)
  const ethersAppContext = useEthersAppContext()
  const selectedChainId = ethersAppContext.chainId

  const notification = useAntNotification()

  /**
   * this shows the page header and other informaiton
   */
  const left = (
    <>
      <div className="absolute top-6 left-4 text-3xl">
        <PageHeader title="🥪 Supersub" subTitle={<></>} style={{ cursor: 'pointer' }} />
      </div>
      {props.children}
    </>
  )

  const onLoginError = useCallback(
    (e: Error) => {
      if (e instanceof UserClosedModalError) {
        notification.info({
          message: connectorErrorText.UserClosedModalError,
          description: e.message,
        })
      } else if (e instanceof NoStaticJsonRPCProviderFoundError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.NoStaticJsonRPCProviderFoundError,
          description: e.message,
        })
      } else if (e instanceof CouldNotActivateError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.CouldNotActivateError,
          description: e.message,
        })
      } else {
        notification.error({ message: 'Login Error: ', description: e.message })
      }
    },
    [notification]
  )

  /**
   * 👨‍💼 Your account is in the top right with a wallet at connect options
   */
  const right = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10, zIndex: 1 }}>
      <Account
        createLoginConnector={props.scaffoldAppProviders.createLoginConnector}
        loginOnError={onLoginError}
        ensProvider={props.scaffoldAppProviders.mainnetAdaptor?.provider}
        price={0}
        blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        hasContextConnect={true}
      />
      {props.children}
    </div>
  )

  /**
   * display the current network on the top left
   */
  let networkDisplay: ReactElement | undefined
  if (selectedChainId && selectedChainId !== props.scaffoldAppProviders.targetNetwork.chainId) {
    const description = (
      <div>
        You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
        <b>{getNetwork(props.scaffoldAppProviders.targetNetwork)?.name ?? 'UNKNOWN'}</b>.
      </div>
    )
    networkDisplay = (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 90, padding: 16 }}>
        <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
      </div>
    )
  } else {
    networkDisplay = (
      <div
        style={{
          position: 'absolute',
          right: 4,
          top: 64,
          padding: 10,
          color: props.scaffoldAppProviders.targetNetwork.color,
        }}>
        {props.scaffoldAppProviders.targetNetwork.name}
      </div>
    )
  }

  return (
    <div className="flex flex-row">
      {left}
      {networkDisplay}
      {right}
    </div>
  )
}
