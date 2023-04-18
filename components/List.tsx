import React from "react";

interface ListItem {
  key: number;
  name: string;
}

interface ListProps {
  items: ListItem[];
  onItemClick: (value: string) => void;
}

const List: React.FC<ListProps> = ({ items, onItemClick }) => {
  return (
    <ul
      style={{
        listStyle: 'none',
        fontFamily: 'SF Mono',
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
              <div>
                <span 
                  style={{ 
                    fontFamily: 'SF Mono',
                    letterSpacing: '-0px',
                    fontWeight: '800',
                    fontSize: '20px'
                  }}
                >
                  {item.name}
                </span>
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
                    fontWeight: '700'
                  }}
                >
                  eth
                </span>
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
