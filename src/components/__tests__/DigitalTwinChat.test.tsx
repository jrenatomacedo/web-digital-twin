import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DigitalTwinChat from '../DigitalTwinChat';
import { useChat } from '@ai-sdk/react';
import '@testing-library/jest-dom';

// Mock the AI SDK hook
jest.mock('@ai-sdk/react', () => ({
  useChat: jest.fn(),
}));

// Mock window.HTMLElement.prototype.scrollIntoView which is called by the chat component
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('DigitalTwinChat', () => {
  const mockSendMessage = jest.fn();

  beforeEach(() => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      status: 'idle',
    });
    mockSendMessage.mockClear();
  });

  it('renders the floating chat button initially', () => {
    render(<DigitalTwinChat />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the chat window when the floating button is clicked', () => {
    render(<DigitalTwinChat />);
    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);

    expect(screen.getByText('Ask me about my experience')).toBeInTheDocument();
  });

  it('allows user to type a message and the send button becomes active', () => {
    render(<DigitalTwinChat />);
    // Open chat
    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByLabelText('Send message');

    // Initially, button should be disabled
    expect(sendButton).toBeDisabled();

    // Type a message
    fireEvent.change(input, { target: { value: 'Hello Digital Twin' } });

    // Button should now be enabled
    expect(sendButton).not.toBeDisabled();
    expect(input).toHaveValue('Hello Digital Twin');
  });

  it('sends the message on form submit and clears input', async () => {
    render(<DigitalTwinChat />);
    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'What is your experience?' } });
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'What is your experience?',
        role: 'user',
      })
    );

    // After submission, input length must be empty
    expect(input).toHaveValue('');
  });

  it('disables the form while loading (status is streaming)', () => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      status: 'streaming',
    });

    render(<DigitalTwinChat />);
    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Something' } });
    
    // Even if input is populated, button is disabled because of loading
    expect(sendButton).toBeDisabled();
  });
});
