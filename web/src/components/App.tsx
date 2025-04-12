import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import ShopInterface from './ShopInterface';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  license: string;
}

interface CartItem extends ShopItem {
  quantity: number;
}

interface Balance {
  cash: number;
  bank: number;
}

const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NuiWrapper = styled.div`
  width: 80%;
  height: 80%;
  position: relative;
  z-index: 1;
  max-width: 1400px;
  max-height: 900px;
`;

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [balance, setBalance] = useState<Balance>({ cash: 0, bank: 0 });
  const [shopTitle, setShopTitle] = useState<string>('Shop');
  const [categories, setCategories] = useState<Category[]>([]);
  const [licenses, setLicenses] = useState<Record<string, boolean>>({});
  useNuiEvent<boolean>('setVisible', (data) => {
    setIsVisible(data);
    if (!data) {
      setCart([]);
      setSelectedCategory('all');
      setSearchQuery('');
      setBalance({ cash: 0, bank: 0 });
      setItems([]);
      setCategories([]);
      setShopTitle('');
    }
  });

  useNuiEvent<string>('setItems', (data) => {
    try {
      const decodedItems = JSON.parse(data);
      setItems(Array.isArray(decodedItems) ? decodedItems : []);
    } catch (error) {
      console.error('Failed to parse items:', error);
      setItems([]);
    }
  });

  useNuiEvent<string>('setBalance', (data) => {
    try {
      const decodedBalance = JSON.parse(data);
      setBalance(decodedBalance || { cash: 0, bank: 0 });
    } catch (error) {
      console.error('Failed to parse balance:', error);
      setBalance({ cash: 0, bank: 0 });
    }
  });

  useNuiEvent<string>('setShopTitle', (data) => {
    setShopTitle(data || 'Shop');
  });

  useNuiEvent<string>('setCategories', (data) => {
    try {
      const decodedCategories: Category[] = [];
      decodedCategories.push({
        id: 'all',
        name: 'All',
        icon: 'fa-solid fa-bars'
      });
      const parsedCategories = JSON.parse(data);
      if (Array.isArray(parsedCategories)) {
        decodedCategories.push(...parsedCategories);
      }
      setCategories(decodedCategories);
    } catch (error) {
      console.error('Failed to parse categories:', error);
      setCategories([{
        id: 'all',
        name: 'All',
        icon: 'fa-solid fa-bars'
      }]);
    }
  });
  useNuiEvent<string>('setLicenses', (data) => {
    const licensesParsed: Record<string, boolean> = JSON.parse(data);
    setLicenses(licensesParsed);
  });
  const handleAddToCart = (item: ShopItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const handlePayment = (method: 'cash' | 'card') => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (method === 'cash' && balance.cash < total) {
      fetchNui('showNotification', {
        title: 'Error',
        description: 'You do not have enough cash to purchase these items.',
        type: 'error'
      });
      return;
    }
    
    if (method === 'card' && balance.bank < total) {
      fetchNui('showNotification', {
        title: 'Error',
        description: 'You do not have enough bank balance to purchase these items.',
        type: 'error'
      });
      return;
    }

    const itemsMap = cart.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    fetchNui('purchaseItems', {
      items: itemsMap,
      paymentType: method
    }).then(response => {
      if (response.success) {
        fetchNui('closeNui');
        setIsVisible(false);
      }
    });
  };

  const filteredItems = items?.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  if (!isVisible) return null;

  return (
    <BackgroundContainer>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      <NuiWrapper>
        <ShopInterface
          items={filteredItems}
          cart={cart}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onPayment={handlePayment}
          onSearch={setSearchQuery}
          balance={balance}
          shopTitle={shopTitle}
          licenses={licenses}
        />
      </NuiWrapper>
    </BackgroundContainer>
  );
};

export default App;
