import { Badge } from './Badge';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default {
    title: 'UI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'danger', 'info'],
            description: 'The semantic variant of the badge',
        },
    },
};

export const Default = {
    args: {
        children: 'New Feature',
        variant: 'default',
    },
};

export const Success = {
    args: {
        children: 'Completed',
        variant: 'success',
        icon: CheckCircle
    },
};

export const Warning = {
    args: {
        children: 'Pending',
        variant: 'warning',
    },
};

export const Danger = {
    args: {
        children: 'Failed',
        variant: 'danger',
        icon: AlertCircle
    },
};

export const InfoBadge = {
    args: {
        children: 'Updates Available',
        variant: 'info',
        icon: Info
    },
};
