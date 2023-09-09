import React from "react"
import Help from './Help'
import * as lang from '../utils/languages'
import { isMobile } from 'react-device-detect'

interface ListItem {
  key: number
  name: string
  migrated: string
}

interface ListProps {
  label: string
  items: ListItem[]
  onItemClickStealth: (value: string) => void
  onItemClickPreview: (value: string) => void
}

const alphabets: string[] = []; // List of all alphabets except 'x'
for (let i = 65; i <= 90; i++) {
  if (String.fromCharCode(i).toLocaleLowerCase() !== 'x') { // Ignore 'x'
    alphabets.push(String.fromCharCode(i).toLocaleLowerCase())
  }
}

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const List: React.FC<ListProps> = ({ label, items, onItemClickStealth, onItemClickPreview }) => {
  const [icon, setIcon] = React.useState('')
  const [help, setHelp] = React.useState('')
  const [color, setColor] = React.useState('')
  const [helpModal, setHelpModal] = React.useState(false)

  return (
    <ul
      className="flex-column"
      style={{
        listStyle: 'none',
        color: 'white'
      }}
    >
      {items.map((item) => (
        <li
          key={item.key}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            marginLeft: !isMobile ? '-9.5%' : '-10.5%'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                marginBottom: '-3px',
                color: 'white'
              }}
            >
              <div>
                {item.name.split('').map((char, index) => (
                  <span
                    key={index}
                    style={{
                      fontFamily: 'SF Mono',
                      letterSpacing: '-0.5px',
                      fontWeight: '600',
                      fontSize: lang.arabic.includes(char) ||
                        lang.hindi.includes(char) ||
                        lang.persian.includes(char) ||
                        lang.chinese.includes(char) ||
                        lang.korean.includes(char)
                        ? '24px' : '21px'
                    }}
                  >
                    {char.toLowerCase()}
                  </span>
                ))}
                <span
                  style={{
                    fontFamily: 'SF Mono',
                    fontSize: '15px',
                    color: 'cyan'
                  }}
                >
                  .
                </span>
                <span
                  style={{
                    fontFamily: 'Spotnik',
                    fontSize: '11px',
                    color: 'cyan',
                    fontWeight: '700',
                    letterSpacing: '0px'
                  }}
                >
                  ETH
                </span>
                {item.migrated === '1' &&
                  <button
                    className="button-tiny"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('gpp_good')
                      setColor('lime')
                      setHelp('<span><span style="color: lime">Ready</span> For Off-chain Use. Domain-specific <span style="color: cyan">Recordhash</span> is Set</span>')
                    }}
                    data-tooltip={'Ready With IPNS Recordhash'}
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'lime'
                      }}
                    >
                      gpp_good
                    </div>
                  </button>
                }
                {item.migrated === '3/4' &&
                  <button
                    className="button-tiny"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('gpp_good')
                      setColor('cyan')
                      setHelp('<span><span style="color: lime">Ready</span> For Off-chain Use. Global <span style="color: cyan">Ownerhash</span> is Set</span>')
                    }}
                    data-tooltip={'Ready With IPNS Ownerhash'}
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'cyan'
                      }}
                    >
                      gpp_good
                    </div>
                  </button>
                }
                {item.migrated === '4/5' &&
                  <button
                    className="button-tiny"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('gpp_good')
                      setColor('yellow')
                      setHelp('<span><span style="color: lime">Ready</span> For Off-chain Use. <span style="color: cyan">HTTP Gateway</span> is Set</span>')
                    }}
                    data-tooltip={'Ready With HTTP Gateway'}
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'yellow'
                      }}
                    >
                      gpp_good
                    </div>
                  </button>
                }
                {item.migrated === '1/2' &&
                  <button
                    className="button-tiny"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('gpp_good')
                      setColor('orange')
                      setHelp('<span>Resolver is <span style="color: lime">migrated</span> but <span style="color: cyan">Storage</span> is <span style="color: orange">not Set</span></span>')
                    }}
                    data-tooltip={'Using Default Gateway'}
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'orange'
                      }}
                    >
                      gpp_good
                    </div>
                  </button>
                }
                {item.migrated === '0' &&
                  <button
                    className="button-tiny"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('gpp_maybe')
                      setColor('orangered')
                      setHelp('<span>Resolver is <span style="color: orange">not migrated</span>. Please <span style="color: cyan">MIGRATE</span> to enable off-chain Records</span>')
                    }}
                    data-tooltip={'Resolver Not Migrated'}
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'orangered'
                      }}
                    >
                      gpp_maybe
                    </div>
                  </button>
                }
              </div>
              <Help
                color={color}
                icon={icon}
                onClose={() => setHelpModal(false)}
                show={helpModal}
              >
                {help}
              </Help>
            </span>
            <div>
              <a
                href={`https://app.ens.domains/name/${item.name.toLowerCase()}.eth`}
                target='_blank'
                rel="noreferrer"
              >
                <img
                  className="icon-ens-small"
                  alt="ens-icon"
                  src="ens.png"
                />
              </a>
              <a
                href={`https://ens.vision/name/${item.name}`}
                target='_blank'
                rel="noreferrer"
              >
                <img
                  className="icon-vision-small"
                  alt="ensvision-icon"
                  src="ens-vision.png"
                />
              </a>
              <a
                style={{ marginRight: '15px' }}
                href={`https://godid.io/items/${item.name.toLowerCase()}.eth`}
                target='_blank'
                rel="noreferrer"
              >
                <img
                  className="icon-godid-small"
                  alt="godid-icon"
                  src="godid.svg"
                />
              </a>
              <button
                className="button"
                style={{
                  alignSelf: 'flex-end',
                  height: '40px',
                  width: '40px'
                }}
                onClick={() => onItemClickStealth(item.name + '.eth')}
                disabled={['0'].includes(item.migrated) || label === "view"}
                data-tooltip={`Stealth Payments`}
              >
                <div
                  className="flex-sans-direction"
                >
                  { }
                  <span
                    className="material-icons-round smoller"
                    style={{
                      fontSize: '25px',
                      fontWeight: '700'
                    }}
                  >
                    {label === "view" ? 'account_balance_wallet' : 'account_balance_wallet'}
                  </span>
                </div>
              </button>
              <button
                className="button"
                style={{
                  alignSelf: 'flex-end',
                  height: '40px',
                  width: '40px',
                  marginLeft: '5px'
                }}
                onClick={() => onItemClickPreview(item.name + '.eth')}
                data-tooltip={`${label} Your Records`}
              >
                <div
                  className="flex-sans-direction"
                >
                  { }
                  <span
                    className="material-icons-round smoller"
                    style={{
                      fontSize: '25px',
                      fontWeight: '700'
                    }}
                  >
                    {label === "view" ? 'policy' : 'edit'}
                  </span>
                </div>
              </button>
            </div>
          </div>
          <hr></hr>
        </li>
      ))}
    </ul>
  )
}

export default List
