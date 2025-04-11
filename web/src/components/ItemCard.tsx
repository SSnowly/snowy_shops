import React, { useState } from 'react';
import styled from 'styled-components';

interface ItemCardProps {
  name: string;
  price: number;
  image: string;
  description: string;
  onAddToCart: () => void;
}

const Card = styled.div`
  aspect-ratio: 1;
  background: var(--background-color);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px var(--shadow-color);
  position: relative;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 60%;
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.2s;
  margin-bottom: 8px;

  &:hover {
    transform: scale(1.05);
  }
`;

const ItemName = styled.div`
  font-size: 1.3rem;
  color: var(--text-color);
  font-weight: normal;
  margin-top: auto;
  margin-bottom: 8px;
`;

const ItemPrice = styled.div`
  font-size: 1.1rem;
  color: var(--primary-color);
  font-weight: bold;
  margin-top: auto;
  margin-bottom: 8px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #333;
  padding: 4px;
  border-radius: 4px;
  flex: 1;
`;

const QuantityButton = styled.button`
  background: #444;
  color: var(--text-color);
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  &:hover {
    background: #555;
  }
`;

const Quantity = styled.span`
  min-width: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #fff;
`;

const AddButton = styled.button`
  background: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  flex: 2;

  &:hover {
    background: var(--primary-hover-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow-color);
  }
`;

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  price,
  image,
  description,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart();
    }
  };

  return (
    <Card>
      <ItemImage src={image} alt={name} />
      <ItemName>{name}</ItemName>
      <ItemPrice>${price.toLocaleString()}</ItemPrice>
      <ControlsContainer>
        <QuantityControls>
          <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
          <Quantity>{quantity}</Quantity>
          <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
        </QuantityControls>
        <AddButton onClick={handleAddToCart}>Add</AddButton>
      </ControlsContainer>
    </Card>
  );
};

export default ItemCard; 