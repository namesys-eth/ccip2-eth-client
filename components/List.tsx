import React from "react";

interface ListItem {
  key: number;
  name: string;
  migrated: boolean;
}

interface ListProps {
  items: ListItem[];
  onItemClick: (value: string) => void;
}

const alphabets: string[] = [];
for (let i = 65; i <= 90; i++) {
  if (String.fromCharCode(i).toLocaleLowerCase() !== 'x') {
    alphabets.push(String.fromCharCode(i).toLocaleLowerCase());
  }
}

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const List: React.FC<ListProps> = ({ items, onItemClick }) => {
  return (
    <ul
      style={{
        listStyle: 'none',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingRight: '2%',
      }}>
      {items.map((item) => (
        <li
          key={item.key}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <span 
              style={{ 
                marginBottom: '-3px',
                color: '#bfbfbf'
              }}
            >
              <div
              >
                {item.name.split('').map((char, index) => (
                  <span key={index}>
                    { !alphabets.includes(char) &&
                      !['x'].includes(char) && (
                      <span
                        style={{ 
                          fontFamily: 'SF Mono',
                          letterSpacing: '-0px',
                          fontWeight: '600',
                          fontSize: '21px'
                        }}
                      >
                        { char }
                      </span>
                    )}
                    { alphabets.includes(char) && (
                      <span
                        style={{ 
                          fontFamily: 'Rajdhani',
                          letterSpacing: '0.3px',
                          fontWeight: '700',
                          fontSize: '26px'
                        }}
                      >
                        { char }
                      </span>
                    )}
                    { ['x'].includes(char) &&
                      numbers.includes(item.name.charAt(index - 1)) &&
                      numbers.includes(item.name.charAt(index + 1)) && (
                      <span
                        style={{ 
                          fontFamily: 'Rajdhani',
                          letterSpacing: '0.3px',
                          fontWeight: '700',
                          fontSize: '24px'
                        }}
                      >
                        { char }
                      </span>
                    )}
                  </span>
                ))}
                <span 
                  style={{ 
                    fontFamily: 'SF Mono',
                    fontSize: '15px', 
                    color: 'skyblue'
                  }}
                >
                  .
                </span>
                <span 
                  style={{ 
                    fontFamily: 'Spotnik',
                    fontSize: '11px', 
                    color: 'skyblue',
                    fontWeight: '700',
                    letterSpacing: '0px'
                  }}
                >
                  ETH
                </span>
                { item.migrated &&
                  <span 
                    style={{ 
                      color: 'lightgreen',
                      marginLeft: '5px'
                    }}
                    className="material-icons smoller"
                  >
                    gpp_good
                  </span>
                }
                { !item.migrated &&
                  <span 
                    style={{ 
                      color: 'orange',
                      marginLeft: '5px'
                    }}
                    className="material-icons smoller"
                  >
                    gpp_maybe
                  </span>
                }
              </div>
            </span>
            <div>
              <a 
                href={`https://app.ens.domains/name/${item.name}.eth`} 
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
                style={{ marginRight: '15px' }}
                href={`https://ens.vision/name/${item.name}.eth`} 
                target='_blank'            
                rel="noreferrer"      
              >
                <img
                  className="icon-vision-small"
                  alt="ensvision-icon"
                  src="ens-vision.png"
                />
              </a>
              <button
                className="button"
                style={{
                  alignSelf: 'flex-end',
                  height: '30px',
                  width: '80px'
                }}
                onClick={() => onItemClick(item.name + '.eth')}
                data-tooltip='Click to edit off-chain records'
              >
                <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '14px'
                    }}
                  >
                      {'edit'}&nbsp;<span className="material-icons smoller">manage_history</span>
                  </div>
              </button>
            </div>
          </div>
          <hr></hr>
        </li>
      ))}
    </ul>
  );
};

export default List;
