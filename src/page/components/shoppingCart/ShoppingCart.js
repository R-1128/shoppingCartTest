
import React from 'react';
import { useDrop } from 'react-dnd';
import './styles.css';

function ShoppingCart({ cartItems, addToCart, removeFromCart }) {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'PRODUCT', // 匹配 DragSource 的 type  
        drop: (item, monitor) => {
            // 当商品被拖拽到购物车时调用 addToCart  
            addToCart(item, cartItems);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), []);

    const handleRemove = (data) => {
        // 查找并更新购物车中的商品数量  
        const updatedCartItems = cartItems.map(item => {
            if (item.id === data.id) {
                if (item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                } else {
                    // 如果数量为1，则不返回该商品，从而从购物车中移除它  
                    return null;
                }
            }
            return item;
        }).filter(item => item !== null); // 移除数量减至0的商品  

        removeFromCart(updatedCartItems, data);
    };
    return (

        <React.Fragment>
            <div className="ShoppingCartContainer">
                <div ref={drop} className='dragContainer'
                    style={{
                        background: isOver && canDrop ? '#c3d59b' : 'transparent', // 当可以放置时改变背景颜色
                    }}
                >
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <div key={item.id} className='cartItem'>
                                <div>
                                    <img src={`https://www.partechgss.com/${item.product_img}`} alt={item.product_name} />
                                </div>
                                <div>
                                    <span>{item.product_name}</span>
                                    <span> 数量:{item.quantity}</span>
                                </div>
                                <div>
                                    <div className='delBtn' onClick={() => handleRemove(item)}>移除</div>
                                    <h2> 单价:{item.unit_price}</h2>
                                </div>
                            </div>
                        ))
                    ) : ''}

                </div>
            </div>
        </React.Fragment>
    );
}

export default ShoppingCart;
