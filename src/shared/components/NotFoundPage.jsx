import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';

const NotFoundPage = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <Card className="text-center" style={{ maxWidth: '500px' }}>
                <Typography variant="h1" className="mb-4 text-primary">404</Typography>
                <Typography variant="h4" className="mb-3">Página no encontrada</Typography>
                <p className="mb-4 text-muted">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>
                <Link to="/">
                    <Button variant="primary">Volver al Inicio</Button>
                </Link>
            </Card>
        </div>
    );
};

export default NotFoundPage;
