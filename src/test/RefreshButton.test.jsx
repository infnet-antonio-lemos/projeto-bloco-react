import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefreshButton from '../components/Common/RefreshButton';

describe('RefreshButton', () => {
  it('renders with default label', () => {
    render(<RefreshButton onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument();
  });

  it('shows loading text and is disabled when loading=true', () => {
    render(<RefreshButton onClick={() => {}} loading={true} />);
    const button = screen.getByRole('button', { name: 'Atualizando...' });
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<RefreshButton onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
