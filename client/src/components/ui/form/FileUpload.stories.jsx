import React, { useState } from 'react';
import { FileUpload } from './FileUpload';

export default {
    title: 'UI/Form/FileUpload',
    component: FileUpload,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        onFileSelect: (files) => console.log('Files selected:', files),
        accept: 'image/*',
        multiple: false,
    },
};

export const MultipleFiles = {
    args: {
        onFileSelect: (files) => console.log('Files selected:', files),
        accept: 'image/*,application/pdf',
        multiple: true,
    },
};
