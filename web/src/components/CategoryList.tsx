import React from 'react';
import styled from 'styled-components';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

interface CategoryItemProps {
  $isSelected: boolean;
}

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  
`;

const CategoryItem = styled.div<CategoryItemProps>`
  padding: 12px 16px;
  background: ${({ $isSelected }: CategoryItemProps) => $isSelected ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ $isSelected }: CategoryItemProps) => $isSelected ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    background: ${({ $isSelected }: CategoryItemProps) => $isSelected ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.08)'};
    border-color: ${({ $isSelected }: CategoryItemProps) => $isSelected ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.2)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    &::before {
      transform: translateX(100%);
    }
  }
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  flex-shrink: 0;
  position: relative;
`;

const CategoryIcon = styled.i`
  font-size: 1.2rem;
  color: var(--text-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryName = styled.span`
  font-size: 0.95rem;
  color: var(--text-color);
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <CategoryContainer>
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          $isSelected={selectedCategory === category.id}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.icon && (
            <IconWrapper>
              <CategoryIcon className={category.icon}></CategoryIcon>
            </IconWrapper>
          )}
          <CategoryName>{category.name}</CategoryName>
        </CategoryItem>
      ))}
    </CategoryContainer>
  );
};

export default CategoryList;