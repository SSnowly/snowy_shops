import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ItemCard from './ItemCard';
import CategoryList from './CategoryList';
import CartItem from './CartItem';
import { DollarSign, CreditCard } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  license: string;
}

interface CartItemType extends ShopItem {
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface ShopInterfaceProps {
  items: ShopItem[];
  cart: CartItemType[];
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  onAddToCart: (item: ShopItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onPayment: (method: 'cash' | 'card') => void;
  onSearch: (query: string) => void;
  balance: {
    cash: number;
    bank: number;
  };
  shopTitle: string;
  licenses: Record<string, boolean>;
  logo: string;
  onClose: () => void;
}

export const IslandBase = styled(motion.div)`
  background: var(--background-color-transparent);
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--shadow-color);
  border: 1px solid var(--border-color);
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover-color);
  }
`;

const ShopContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: auto 1fr;
  background: transparent;
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
  gap: 20px;
  padding: 20px;
`;

const TopBar = styled(IslandBase)`
  grid-column: 2 / 3;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
`;

const BalanceInfo = styled.div`
  display: flex;
  gap: 0px;
  align-items: center;
`;

const BalanceItem = styled.div<{ type: 'cash' | 'bank' }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 5px;
  border-radius: 16px;
  transition: all 0.3s ease;
  min-width: 120px;
  position: relative;
  overflow: hidden;

`;

const BalanceLabel = styled.div<{ type: 'cash' | 'bank' }>`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BalanceIcon = styled.div<{ type: 'cash' | 'bank' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props: { type: 'cash' | 'bank' }) => props.type === 'cash' 
    ? 'rgba(74, 226, 112, 0.2)' 
    : 'rgba(74, 144, 226, 0.2)'};
  color: ${(props: { type: 'cash' | 'bank' }) => props.type === 'cash' 
    ? 'rgba(74, 226, 112, 0.9)' 
    : 'rgba(74, 144, 226, 0.9)'};
`;

const BalanceAmount = styled.span<{ type: 'cash' | 'bank' }>`
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  color: ${(props: { type: 'cash' | 'bank' }) => props.type === 'cash' 
    ? 'rgba(74, 226, 112, 0.95)' 
    : 'rgba(74, 144, 226, 0.95)'};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CategorySidebar = styled(IslandBase)`
  grid-column: 1;
  grid-row: 1 / -1;
  padding: 20px;
  overflow-y: auto;
  height: calc(100% - 40px);
  
`;

const MainContent = styled(IslandBase)`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const SearchBar = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ItemsGrid = styled.div`
  padding: 20px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  height: calc(100% - 80px);
  grid-auto-rows: min-content;

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover-color);
  }
`;

const CartSidebar = styled(IslandBase)`
  grid-column: 3;
  grid-row: 1 / -1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 95%;
  position: relative;
`;

const CartHeader = styled.div`
  position: relative;
  margin-bottom: 40px;
  text-align: center;
`;

const CartLogo = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -55%);
  display: flex;
  max-height: 100px;
  width: 200px;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CartTitle = styled.h2`
  margin: 0;
  padding-top: 60px;
  font-size: 1.5rem;
  color: #fff;
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover-color);
  }
`;

const CartFooter = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #333;
`;

const PaymentSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const PaymentButton = styled.button`
  flex: 1;
  padding: 12px;
  background: var(--button-bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: var(--background-hover-color);
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const SearchInput = styled.input`
  padding-left: 10px;
  margin: auto;
  width: 97%;
  border-radius: 6px;
  line-height: 2.5;
  border: 1px solid #333;
  background: var(--background-color);
  color: var(--text-color);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TotalAmount = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--primary-color);
`;

const ShopInterface: React.FC<ShopInterfaceProps> = ({
  items,
  cart,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onPayment,
  onSearch,
  balance,
  shopTitle,
  licenses,
  logo,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Escape') {
      e.stopPropagation();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animations to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 400); // slightly longer than animation duration
  };
  useEffect(() => {
       const KeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          handleClose();
        }
      };
      window.addEventListener('keydown', KeyDown, false);
      return () => {
        window.removeEventListener('keydown', KeyDown, false);
      }
    });
  return (
    <AnimatePresence mode="wait" onExitComplete={() => onClose()}>
      {!isClosing && (
        <ShopContainer>
          <CategorySidebar
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
            />
          </CategorySidebar>

          <TopBar
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          >
            <Title>{shopTitle}</Title>
            <BalanceInfo>
              <BalanceItem type="cash">
                <BalanceLabel type="cash">
                  <BalanceIcon type="cash"><DollarSign size={16} /></BalanceIcon>
                  <BalanceAmount type="cash">${balance.cash.toLocaleString()}</BalanceAmount>
                </BalanceLabel>
              </BalanceItem>
              <BalanceItem type="bank">
                <BalanceLabel type="bank">
                  <BalanceIcon type="bank"><CreditCard size={16} /></BalanceIcon>
                  <BalanceAmount type="bank">${balance.bank.toLocaleString()}</BalanceAmount>
                </BalanceLabel>
              </BalanceItem>
            </BalanceInfo>
          </TopBar>

          <MainContent
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          >
            <SearchBar>
              <SearchInput
                type="text"
                placeholder="Search items..."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </SearchBar>
            <ItemsGrid>
              {items.map(item => (
                <ItemCard
                  key={item.id}
                  {...item}
                  onAddToCart={() => onAddToCart(item)}
                  license={item.license}
                  licenses={licenses}
                />
              ))}
            </ItemsGrid>
          </MainContent>

          <CartSidebar
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
          >
            <CartHeader>
              <CartLogo>
                <img src={logo} alt="Cart Logo" />
              </CartLogo>
              <CartTitle>Your Cart</CartTitle>
            </CartHeader>
            <CartItems>
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
                  onRemove={() => onRemoveFromCart(item.id)}
                />
              ))}
            </CartItems>
            <CartFooter>
              <TotalAmount>Total: ${total.toLocaleString()}</TotalAmount>
              <PaymentSection>
                <PaymentButton onClick={() => onPayment('cash')}>
                  <DollarSign color="var(--button-cash-color)" />
                  Cash
                </PaymentButton>
                <PaymentButton onClick={() => onPayment('card')}>
                  <CreditCard color="var(--button-bank-color)" />
                  Card
                </PaymentButton>
              </PaymentSection>
            </CartFooter>
          </CartSidebar>
        </ShopContainer>
      )}
    </AnimatePresence>
  );
};

export default ShopInterface;