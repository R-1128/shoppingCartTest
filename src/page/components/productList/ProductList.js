import React from 'react';
import { useDrag } from 'react-dnd';
import './styles.css';

function Product({ id, product_name, unit_price, quantity_in_stock, product_img }) {
  // 使用 useDrag 钩子定义拖拽逻辑  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PRODUCT', // 拖拽类型，与接收拖拽的组件匹配  
    item: () => ({ id, product_name, unit_price, quantity_in_stock, product_img }), // 拖拽时传递的数据  
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag}
      className='goodsItem'>
      <div className='goodsItemLf'>
        <img src={`https://www.partechgss.com/${product_img}`} />
      </div>
      <div className='goodsItemRt'>
        <div>
          {product_name}
        </div>
        <div>
          库存{quantity_in_stock}
        </div>
        <div>
          ${unit_price}
        </div>
      </div>
    </div>
  );
}


function ProductList({ goodsItems }) {
  return (
    <React.Fragment>
      <div className='goodsContainer'>
        <div className='goodsList'>
          {goodsItems.map(item => (
            <Product key={item.id} {...item} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProductList;

