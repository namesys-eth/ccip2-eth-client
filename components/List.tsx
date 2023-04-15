import React from "react";

interface ListItem {
  key: number;
  name: string;
}

interface ListProps {
  items: ListItem[];
  onItemClick: (key: number) => void;
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
            </span>
            <button
              className="button"
              style={{
                alignSelf: 'flex-end',
                height: '30px',
                width: '100px'
              }}
              onClick={() => onItemClick(item.key)}
              data-tooltip='Click to edit off-chain records'
            >
              <div 
                  className="smol"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                    {'edit'}&nbsp;<span className="material-icons smoller">manage_history</span>
                </div>
            </button>
          </div>
          <hr></hr>
        </li>
      ))}
    </ul>
  );
};

export default List;
