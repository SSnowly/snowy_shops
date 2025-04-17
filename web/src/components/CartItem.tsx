import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CartItemProps {
  name: string;
  price: number;
  quantity: number;
  image: string;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

const ItemContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px;
  background: var(--background-color);
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid var(--border-color);
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const ItemPrice = styled.div`
  color: var(--primary-color);
  font-size: 0.9rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  background: #333;
  color: var(--text-color);
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  &:hover {
    background: #444;
  }
`;

const Quantity = styled.span`
  min-width: 16px;
  text-align: center;
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  color: #e74c3c;
  border: none;
  padding: 2px;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    color: #c0392b;
  }
`;

const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove
}) => {
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0) {
      onUpdateQuantity(newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      layout
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
    >
      <ItemContainer>
        <ItemImage src={image} alt={name} />
        <ItemDetails>
          <div>
            <ItemName>{name}</ItemName>
            <ItemPrice>${price.toLocaleString()}</ItemPrice>
          </div>
          <QuantityControls>
            <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
            <Quantity>{quantity}</Quantity>
            <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
          </QuantityControls>
        </ItemDetails>
        <RemoveButton onClick={onRemove}>
          <X />
        </RemoveButton>
      </ItemContainer>
    </motion.div>
  );
};

export default CartItem;