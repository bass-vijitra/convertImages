import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnimatedBorderImage from '@/app/components/AnimatedBorderImage';

describe('AnimatedBorderImage Component', () => {
  it('renders an image with correct src and alt attributes', () => {
    const { container } = render(
      <AnimatedBorderImage src="/test-image.jpg" alt="Test Image" size={100} />
    );
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Image');
  });

  it('applies the dynamic size styling', () => {
    const { container } = render(
      <AnimatedBorderImage src="/test-image.jpg" alt="Test Image" size={80} />
    );
    
    // The main wrapper should be size + 8
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: '88px', height: '88px' });
    
    // The inner image container should be exactly the size
    const innerContainer = container.querySelector('.relative.rounded-full.overflow-hidden');
    expect(innerContainer).toHaveStyle({ width: '80px', height: '80px' });
  });

  it('contains the animated border element', () => {
    const { container } = render(
      <AnimatedBorderImage src="/test.jpg" alt="Test" />
    );
    
    // Check for the div with our custom spinning gradient CSS class
    const animatedBorder = container.querySelector('.animate-spin-slow');
    expect(animatedBorder).toBeInTheDocument();
    expect(animatedBorder).toHaveClass('bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)]');
  });
});
