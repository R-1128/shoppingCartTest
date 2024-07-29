import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductList from './components/productList/ProductList';//商品列表组件
import ShoppingCart from './components/shoppingCart/ShoppingCart';// 购物车组件
import { Spin } from 'antd';
import './styles.css';


function HomePage() {
  const [cartItems, setCartItems] = useState([]);// 初始化购物车数据
  const [goodsItems, setGoodsItems] = useState([]);//初始化商品数据
  const [spinning, setSpinning] = useState(false);//加载中标识

  // 存储拖拽至购物车的商品 
  const addToCart = (item) => {
    // 这里通过闭包访问了当前的 cartItems 状态  
    setCartItems(prevCartItems => {
      // prevCartItems 是上一次的状态值，即当前的 cartItems  
      const existingItem = prevCartItems.find(c => c.id === item.id);
      if (existingItem) {
        // 如果购物车中已存在该商品，则增加数量  
        return prevCartItems.map(c =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        // 如果购物车中不存在该商品，则添加到购物车  
        return [...prevCartItems, { ...item, quantity: 1 }];
      }
    });
    updateGoodsItemFun(item.id)
  };

  // 修改商品数量
  const updateGoodsItemFun = (id) => {
    setGoodsItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity_in_stock: item.quantity_in_stock - 1 } : item)
    );
  };


  const removeFromCart = (newCartItems, data) => {
    setGoodsItems(prev => prev.map(item =>
      item.id === data.id ? { ...item, quantity_in_stock: item.quantity_in_stock + 1 } : item)
    );
    setCartItems(newCartItems);
  };

  // 计算购物车总价格
  const totalPrice = cartItems.reduce((total, item) => total + item.unit_price * item.quantity, 0);

  // 结账功能
  const checkoutFun = () => {
    // 将购物车信息存储到localStorage中
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  // 检索新库存方法
  const searchFun = () => {
    setSpinning(true);
    // 通过配置代理解决跨域问题
    fetch('/api/inventory').then(res => {
      res.text().then(xmlData => {
        // 将文本内容解析为 XML DOM 对象
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

        // 处理 XML DOM 对象
        const productNodes = xmlDoc.getElementsByTagName('product');
        const products = [];

        for (let i = 0; i < productNodes.length; i++) {
          const productNode = productNodes[i];
          const product = {
            id: productNode.getElementsByTagName('product_id')[0].textContent,
            product_name: productNode.getElementsByTagName('product_name')[0].textContent,
            unit_price: parseFloat(productNode.getElementsByTagName('unit_price')[0].textContent),
            quantity_in_stock: parseInt(productNode.getElementsByTagName('quantity_in_stock')[0].textContent, 10),
            product_img: productNode.getElementsByTagName('product_img')[0].textContent.trim()
          };
          products.push(product);
        }
        setSpinning(false);
        setGoodsItems(products);
      })
    })
  }

  useEffect(() => {
    // 判断存储到localStorage中的购物车信息，如果有则赋值给cartItems
    const cartItemsFromStorage = JSON.parse(localStorage.getItem('cartItems'));
    if (cartItemsFromStorage) {
      setCartItems(cartItemsFromStorage);
    }
  }, [])

  useEffect(() => {
    // 调用检索新库存函数 
    searchFun();
  }, []); // 空数组表示这个effect只在组件挂载时运行一次  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="containerBox">
        <div className="containerLf">
          <div className='searchBox' onClick={searchFun}>检索新库存</div>
          <Spin tip="请稍后，正在检索结果"
            size="small"
            spinning={spinning}
          >
            <ProductList
              goodsItems={goodsItems}
            />
          </Spin>

        </div>
        <div className="containerRt">
          <ShoppingCart
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
          <div className='checkoutDiv' onClick={checkoutFun}>结账</div>
          <div className='totalDiv'>
            购物车总：<span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default HomePage;
