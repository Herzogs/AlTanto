import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UserAvatar from '@components/header/UserAvatar';  

describe('UserAvatar component', () => {
    it('should render correctly with given name and lastName', () => {
        render(<UserAvatar name="John" lastName="Doe" />);
        
        const avatarElement = screen.getByText("JD");
        expect(avatarElement).toBeInTheDocument();
    });

    it('should display the correct initials for the name and lastName', () => {
        render(<UserAvatar name="Jane" lastName="Smith" />);
        
        const avatarElement = screen.getByText("JS");
        expect(avatarElement).toBeInTheDocument();
    });

});
