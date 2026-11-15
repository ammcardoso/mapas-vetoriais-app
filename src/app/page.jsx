"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const MapaVetorial = dynamic(() => import("../components/MapaVetorial"), {
    ssr: false,
    loading: () => <p className={styles.instrucaoVazio}>Carregando mapa das regiões de Londrina...</p>,
});

export default function Home() {
    const [regiao, setRegiao] = useState(null);

    return (
        <main className={styles.container}>
            <header className={styles.cabecalho}>
                <h1>SIG-Web: Regiões Administrativas de Londrina/PR</h1>
                <p>Visualização vetorial em polígonos (Norte, Sul, Leste, Oeste e Central)</p>
            </header>

            <section className={styles.mapaWrapper}>
                <MapaVetorial onSelecionarRegiao={setRegiao} />
            </section>

            <section className={styles.cardPainel}>
                <h2 className={styles.cardTitulo}>Tabela de Atributos (properties)</h2>

                {regiao ? (
                    <div className={styles.gridAtributos}>
                        <div className={styles.itemAtributo}>
                            <span className={styles.itemRotulo}>Região</span>
                            <span className={styles.itemValor} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        backgroundColor: regiao.cor,
                                        display: "inline-block",
                                    }}
                                />
                                {regiao.nome}
                            </span>
                        </div>
                        <div className={styles.itemAtributo}>
                            <span className={styles.itemRotulo}>População Estimada</span>
                            <span className={styles.itemValor}>
                                ~{regiao.populacao_estimada?.toLocaleString("pt-BR")} habitantes
                            </span>
                        </div>
                        <div className={styles.itemAtributo}>
                            <span className={styles.itemRotulo}>Principais Bairros</span>
                            <span className={styles.itemValor}>{regiao.principais_bairros}</span>
                        </div>
                        <div className={styles.itemAtributo}>
                            <span className={styles.itemRotulo}>Perfil Urbano</span>
                            <span className={styles.itemValor}>{regiao.perfil}</span>
                        </div>
                    </div>
                ) : (
                    <p className={styles.instrucaoVazio}>
                        Clique em uma das regiões coloridas no mapa (Norte, Sul, Leste, Oeste ou Central) para consultar seus atributos.
                    </p>
                )}
            </section>

            <footer className={styles.rodape}>
                Londrina / PR - Polígonos Regionais em GeoJSON.
            </footer>
        </main>
    );
}