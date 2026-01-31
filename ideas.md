Admin Dashboard - tab links - hover state isn't obvious, add some visual feedback. Maybe an underline?

Media Library - touch area for buttons for copying the URL and delete should be larger - maybe spread across the whole space?
Remove the max-height from the img tag. It prevents it filling the space.
Is the regerenerate button using our button component?

User dropdown menu in the header - the logout should just be a link, not a button. The other links aren't obvious on hover (underline or equivalent required)

http://localhost:5173/admin/settings
Uncaught ReferenceError: useState is not defined
    at ImageSelect (ImageSelect.jsx:15:33)
ImageSelect	@	ImageSelect.jsx:15
<ImageSelect>		
AdminSettings	@	AdminSettings.jsx:86
<AdminSettings>		
App	@	App.jsx:72
<App>		
(anonymous)	@	main.jsx:18
installHook.js:1 An error occurred in the <ImageSelect> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
overrideMethod	@	installHook.js:1
<ImageSelect>		
AdminSettings	@	AdminSettings.jsx:86
<AdminSettings>		
App	@	App.jsx:72
<App>		
(anonymous)	@	main.jsx:18



Toasts - styles seem to have gone wrong. They no longer sit centrally on the page.