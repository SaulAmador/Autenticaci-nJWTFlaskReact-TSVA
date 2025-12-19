import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Private = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchPrivateData = async () => {
            const token = localStorage.getItem("token");
            console.log("token in localStorage", token);

            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!resp.ok) {
                    throw new Error(`Error ${resp.status}: ${resp.statusText}`);
                }

                const result = await resp.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching private data:", error);
            }
        };

        fetchPrivateData();
    }, []);

    return (

        <div className="container text-center mt-5">
            {/* Título con icono (si tienes FontAwesome, si no, quita el <i>) */}
            <h1>
                <i className="fa-solid fa-shield-halved text-primary"></i> Panel Privado
            </h1>

            {data ? (
                <div
                    className="card mx-auto mt-4 shadow-lg"
                    style={{ maxWidth: "400px", borderRadius: "15px" }}
                >
                    <div
                        className="card-header bg-primary text-white"
                        style={{ borderRadius: "15px 15px 0 0" }}
                    >
                        <h4 className="mb-0">Perfil de Usuario</h4>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title mb-3">¡Bienvenido!</h5>
                        <div className="text-start mb-3">
                            <p>
                                <strong>ID de Usuario:</strong>{" "}
                                <span className="badge bg-secondary">{data.user.id}</span>
                            </p>
                            <p>
                                <strong>Email:</strong> {data.user.email}
                            </p>
                            <p>
                                <strong>Estado:</strong>{" "}
                                {data.user.is_active ? (
                                    <span className="text-success fw-bold">Activo ✅</span>
                                ) : (
                                    <span className="text-danger fw-bold">Inactivo ❌</span>
                                )}
                            </p>
                        </div>
                        <p className="text-muted small alert alert-light border">
                            Este es contenido seguro. Solo tú puedes verlo porque tienes un token válido.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <Link to="/" className="btn btn-outline-secondary">
                    ← Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default Private;