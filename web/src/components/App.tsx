import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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

interface Theme {
  background: { r: number; g: number; b: number };
  secondary: { r: number; g: number; b: number };
  primary: { r: number; g: number; b: number };
  text: { r: number; g: number; b: number };
  border: { r: number; g: number; b: number; a: number };
  button: {
    cash: { r: number; g: number; b: number };
    bank: { r: number; g: number; b: number };
  };
  scrollbar: {
    track: { r: number; g: number; b: number };
    thumb: { r: number; g: number; b: number };
    thumbHover: { r: number; g: number; b: number };
  };
  logo?: string;
}

interface ShopData {
  visible: boolean;
  title: string;
  items: ShopItem[];
  categories: Category[];
  licenses: Record<string, boolean>;
  balance: Balance;
  theme: Theme;
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
  const [Logo, setLogo] = useState<string>('https://i.ibb.co/GQNykkH5/logo.png');
  useNuiEvent<string>('setShopData', (data) => {
    try {
      const shopData: ShopData = JSON.parse(data);

      setIsVisible(shopData.visible);
      setShopTitle(shopData.title);
      setItems(shopData.items);
      setCategories([
        {
          id: 'all',
          name: 'All',
          icon: 'fas fa-store'
        },
        ...shopData.categories
      ]);
      setLicenses(shopData.licenses);
      setBalance(shopData.balance);

      const root = document.body;
      const theme = shopData.theme;
      console.log("Setting theme", theme);
      root.style.setProperty('--background-color', `rgb(${theme.background.r}, ${theme.background.g}, ${theme.background.b})`);
      root.style.setProperty('--background-color-transparent', `rgba(${theme.background.r}, ${theme.background.g}, ${theme.background.b}, 0.95)`);
      root.style.setProperty('--background-hover-color', `rgb(${theme.secondary.r}, ${theme.secondary.g}, ${theme.secondary.b})`);
      root.style.setProperty('--primary-color', `rgb(${theme.primary.r}, ${theme.primary.g}, ${theme.primary.b})`);
      root.style.setProperty('--primary-hover-color', `rgb(${theme.secondary.r}, ${theme.secondary.g}, ${theme.secondary.b})`);
      root.style.setProperty('--text-color', `rgb(${theme.text.r}, ${theme.text.g}, ${theme.text.b})`);
      root.style.setProperty('--border-color', `rgba(${theme.border.r}, ${theme.border.g}, ${theme.border.b}, ${theme.border.a})`);
      root.style.setProperty('--button-bg-color', `rgb(${theme.background.r}, ${theme.background.g}, ${theme.background.b})`);
      root.style.setProperty('--button-cash-color', `rgb(${theme.button.cash.r}, ${theme.button.cash.g}, ${theme.button.cash.b})`);
      root.style.setProperty('--button-bank-color', `rgb(${theme.button.bank.r}, ${theme.button.bank.g}, ${theme.button.bank.b})`);
      root.style.setProperty('--scrollbar-track-color', `rgb(${theme.scrollbar.track.r}, ${theme.scrollbar.track.g}, ${theme.scrollbar.track.b})`);
      root.style.setProperty('--scrollbar-thumb-color', `rgb(${theme.scrollbar.thumb.r}, ${theme.scrollbar.thumb.g}, ${theme.scrollbar.thumb.b})`);
      root.style.setProperty('--scrollbar-thumb-hover-color', `rgb(${theme.scrollbar.thumbHover.r}, ${theme.scrollbar.thumbHover.g}, ${theme.scrollbar.thumbHover.b})`);
      setLogo(theme.logo ? theme.logo : 'https://i.ibb.co/GQNykkH5/logo.png');
    } catch (error) {
      console.error('Failed to parse shop data:', error);
    }
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
  const handleClose = () => {
    setIsVisible(false);
    fetchNui('closeNui');
  };
  const filteredItems = items?.filter(item => {
    const categoryExists = categories.some(category => category.id === item.category);
    if (!categoryExists) {
      return false;
    }
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];
  
  if (!isVisible) return null;

  return (
    <BackgroundContainer>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      <NuiWrapper>
        {isVisible && (
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
            logo={Logo}
            onClose={() => handleClose()}
          />
        )}
      </NuiWrapper>
    </BackgroundContainer>
  );
};

export default App;
