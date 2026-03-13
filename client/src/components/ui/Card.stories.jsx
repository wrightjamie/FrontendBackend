import { Card, CardHeader, CardBody, CardFooter } from './Card';

export default {
    title: 'UI/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        dense: {
            control: 'boolean',
            description: 'Reduces padding inside the card',
        },
    },
};

export const Default = {
    render: (args) => (
        <Card {...args} style={{ maxWidth: '400px' }}>
            <CardBody>
                This is a simple card with only a body.
            </CardBody>
        </Card>
    ),
    args: {
        dense: false,
    },
};

export const WithHeaderAndFooter = {
    render: (args) => (
        <Card {...args} style={{ maxWidth: '400px' }}>
            <CardHeader>
                <h3 style={{ margin: 0 }}>Card Title</h3>
            </CardHeader>
            <CardBody>
                <p>This card has a header, a body, and a footer.</p>
                <p>It's useful for displaying structured content.</p>
            </CardBody>
            <CardFooter>
                <button style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>Action</button>
            </CardFooter>
        </Card>
    ),
    args: {
        dense: false,
    },
};

export const Dense = {
    render: (args) => (
        <Card {...args} style={{ maxWidth: '400px' }}>
            <CardHeader>
                <h3 style={{ margin: 0 }}>Dense Card</h3>
            </CardHeader>
            <CardBody>
                <p>This card uses the <code>dense</code> prop to reduce internal padding.</p>
            </CardBody>
        </Card>
    ),
    args: {
        dense: true,
    },
};
