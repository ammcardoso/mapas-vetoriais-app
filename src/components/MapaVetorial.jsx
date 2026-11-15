"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CENTRO_LONDRINA = [-23.305, -51.165];

function estiloRegiao(feature) {
    const cor = feature.properties?.cor || "#0284c7";
    return {
        color: cor,
        weight: 2,
        opacity: 0.9,
        fillColor: cor,
        fillOpacity: 0.25,
    };
}

export default function MapaVetorial({ onSelecionarRegiao }) {
    const [dadosVetor, setDadosVetor] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [tipoCamada, setTipoCamada] = useState("ruas");

    useEffect(() => {
        fetch("/londrina-regioes.geojson")
            .then((resposta) => {
                if (!resposta.ok) {
                    throw new Error(`Falha ao baixar o GeoJSON: HTTP ${resposta.status}`);
                }
                return resposta.json();
            })
            .then((dados) => setDadosVetor(dados))
            .catch((erro) => console.error("Erro ao carregar GeoJSON:", erro))
            .finally(() => setCarregando(false));
    }, []);

    function aoConfigurarFeicao(feature, layer) {
        const p = feature.properties;

        const conteudoPopup = `
            <div style="font-family: system-ui, sans-serif; min-width: 220px; color: #0f172a;">
                <h4 style="margin: 0 0 6px 0; color: ${p.cor || "#0284c7"}; font-size: 15px;">
                    ${p.nome}
                </h4>
                <p style="margin: 3px 0; font-size: 12px;">
                    <strong>População estimada:</strong> ~${p.populacao_estimada?.toLocaleString("pt-BR")} hab.
                </p>
                <p style="margin: 3px 0; font-size: 12px;">
                    <strong>Principais bairros:</strong> ${p.principais_bairros}
                </p>
                <p style="margin: 3px 0; font-size: 12px;">
                    <strong>Perfil:</strong> ${p.perfil}
                </p>
            </div>
        `;

        layer.bindPopup(conteudoPopup);

        layer.on({
            mouseover: (e) => {
                e.target.setStyle({
                    weight: 4,
                    fillOpacity: 0.5,
                });
            },
            mouseout: (e) => {
                e.target.setStyle(estiloRegiao(feature));
            },
            click: () => onSelecionarRegiao(p),
        });
    }

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155" }}>
            <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000, background: "rgba(15, 23, 42, 0.9)", border: "1px solid #334155", borderRadius: 8, padding: 4, display: "flex", gap: 4 }}>
                <button
                    type="button"
                    onClick={() => setTipoCamada("satelite")}
                    style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: tipoCamada === "satelite" ? "#0284c7" : "transparent",
                        color: tipoCamada === "satelite" ? "#fff" : "#94a3b8",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Satélite
                </button>
                <button
                    type="button"
                    onClick={() => setTipoCamada("ruas")}
                    style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: tipoCamada === "ruas" ? "#0284c7" : "transparent",
                        color: tipoCamada === "ruas" ? "#fff" : "#94a3b8",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Ruas
                </button>
            </div>

            {carregando && (
                <div style={{ position: "absolute", top: 12, left: 56, zIndex: 1000, background: "rgba(15, 23, 42, 0.9)", color: "#38bdf8", padding: "6px 12px", borderRadius: 6, fontSize: 12 }}>
                    Carregando Regiões de Londrina...
                </div>
            )}

            <MapContainer center={CENTRO_LONDRINA} zoom={12} style={{ height: "100%", width: "100%" }}>
                {tipoCamada === "satelite" ? (
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="&copy; ESRI World Imagery"
                        maxZoom={19}
                    />
                ) : (
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                        maxZoom={19}
                    />
                )}

                {dadosVetor && (
                    <GeoJSON
                        data={dadosVetor}
                        style={estiloRegiao}
                        onEachFeature={aoConfigurarFeicao}
                    />
                )}
            </MapContainer>
        </div>
    );
}