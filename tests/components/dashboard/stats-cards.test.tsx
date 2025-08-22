import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import StatsCards from '../../../client/src/components/dashboard/stats-cards';

describe('StatsCards', () => {
  it('renders loading state correctly', () => {
    render(<StatsCards stats={{}} loading={true} />);

    const loadingElements = screen.getAllByText('Loading...');
    expect(loadingElements).toHaveLength(4); // Should have 4 stat cards
  });

  it('renders stats data correctly', () => {
    const mockStats = {
      totalPosts: 25,
      totalLikes: 1250,
      totalShares: 300,
      totalComments: 180,
    };

    render(<StatsCards stats={mockStats} loading={false} />);

    expect(screen.getByText('Total Posts')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    
    expect(screen.getByText('Total Likes')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    
    expect(screen.getByText('Total Shares')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    
    expect(screen.getByText('Total Comments')).toBeInTheDocument();
    expect(screen.getByText('180')).toBeInTheDocument();
  });

  it('handles missing stats gracefully', () => {
    render(<StatsCards stats={{}} loading={false} />);

    expect(screen.getByText('Total Posts')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    
    expect(screen.getByText('Total Likes')).toBeInTheDocument();
    expect(screen.getByText('Total Shares')).toBeInTheDocument();
    expect(screen.getByText('Total Comments')).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    const mockStats = {
      totalPosts: 1000,
      totalLikes: 1500000,
      totalShares: 25000,
      totalComments: 85000,
    };

    render(<StatsCards stats={mockStats} loading={false} />);

    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('1,500,000')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
    expect(screen.getByText('85,000')).toBeInTheDocument();
  });

  it('renders with proper data-testid attributes', () => {
    const mockStats = {
      totalPosts: 25,
      totalLikes: 1250,
      totalShares: 300,
      totalComments: 180,
    };

    render(<StatsCards stats={mockStats} loading={false} />);

    expect(screen.getByTestId('text-total-posts')).toBeInTheDocument();
    expect(screen.getByTestId('text-total-likes')).toBeInTheDocument();
    expect(screen.getByTestId('text-total-shares')).toBeInTheDocument();
    expect(screen.getByTestId('text-total-comments')).toBeInTheDocument();
  });
});