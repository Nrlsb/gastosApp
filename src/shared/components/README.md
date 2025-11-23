# Componentes Reutilizables y Sistema de Diseño

Este directorio contiene los componentes reutilizables y la base del sistema de diseño para la aplicación. El objetivo es mantener la consistencia visual y acelerar el desarrollo.

## Tokens de Diseño (Variables CSS)

Los tokens de diseño se definen en `src/styles/variables.css`. Estos son variables CSS que puedes usar en tus archivos CSS para mantener la consistencia en colores, espaciado, tipografía, sombras, etc.

**Ejemplo de uso:**

```css
.mi-clase {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}
```

## Componentes Reutilizables

### Button

Un componente de botón que envuelve los estilos de Bootstrap.

**Uso:**

```jsx
import Button from './ui/Button';

// Botón primario por defecto
<Button>Haz clic</Button>

// Botón de peligro
<Button variant="danger">Eliminar</Button>

// Botón grande
<Button size="lg">Guardar</Button>

// Botón con clases adicionales
<Button variant="info" className="w-100">Enviar</Button>
```

**Props:**

*   `children`: Contenido del botón.
*   `variant`: (`'primary'`, `'secondary'`, `'success'`, `'danger'`, `'warning'`, `'info'`, `'light'`, `'dark'`, `'link'`) - Define el estilo del botón (por defecto: `'primary'`).
*   `size`: (`'sm'`, `'lg'`) - Define el tamaño del botón.
*   `className`: Clases CSS adicionales.
*   `...props`: Cualquier otra prop estándar de HTML `<button>`.

### Input

Un componente de entrada de formulario con etiqueta, que envuelve los estilos de Bootstrap.

**Uso:**

```jsx
import Input from './forms/Input';

<Input
  id="nombreUsuario"
  label="Nombre de Usuario"
  type="text"
  placeholder="Introduce tu nombre"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  required
/>
```

**Props:**

*   `label`: Texto de la etiqueta.
*   `id`: ID del input (necesario para la accesibilidad de la etiqueta).
*   `type`: Tipo de input (`'text'`, `'email'`, `'password'`, etc.) (por defecto: `'text'`).
*   `className`: Clases CSS adicionales para el elemento `<input>`.
*   `...props`: Cualquier otra prop estándar de HTML `<input>`.

### Card

Un componente de tarjeta que envuelve los estilos de Bootstrap.

**Uso:**

```jsx
import Card from './ui/Card';

<Card style={{ maxWidth: '500px' }}>
  <h3>Título de la Tarjeta</h3>
  <p>Contenido de la tarjeta aquí.</p>
</Card>
```

**Props:**

*   `children`: Contenido de la tarjeta.
*   `className`: Clases CSS adicionales.
*   `...props`: Cualquier otra prop estándar de HTML `<div>`.

### Typography

Un componente para gestionar la tipografía de forma consistente.

**Uso:**

```jsx
import Typography from './ui/Typography';

// Título principal
<Typography variant="h1" className="text-center">Mi Título</Typography>

// Párrafo
<Typography variant="p">Este es un párrafo de texto.</Typography>

// Texto en línea
<Typography variant="span" style={{ color: 'var(--color-text-medium)' }}>Texto pequeño</Typography>
```

**Props:**

*   `children`: Contenido de texto.
*   `variant`: (`'h1'`, `'h2'`, `'h3'`, `'h4'`, `'h5'`, `'h6'`, `'p'`, `'span'`) - La etiqueta HTML a renderizar (por defecto: `'p'`).
*   `className`: Clases CSS adicionales.
*   `...props`: Cualquier otra prop estándar del elemento HTML renderizado.
