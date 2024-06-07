import React, { useState, useEffect, useRef } from 'react';
import './css/PullToRefresh.css';
import { IoIosRefresh } from "react-icons/io";
import axios from "axios";

const PullToRefresh = ({ onRefresh, children }) => {
    const refreshContainerRef = useRef(null);
    const spinnerContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [startY, setStartY] = useState(0);

    const fetchData = async () => {
        try {
            // Effectuer une requête HTTP pour récupérer de nouvelles données
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_publications/`);
            // Mettre à jour l'état ou le contenu de la page avec les nouvelles données
            console.log("donnees:", response); // Afficher les nouvelles données dans la console
            // Mettre à jour l'état ou le contenu de la page avec les nouvelles données
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    useEffect(() => {
        const refreshContainer = refreshContainerRef.current;
        const spinnerContainer = spinnerContainerRef.current;

        const loadInit = async () => {
            if (refreshContainer && spinnerContainer) {
                refreshContainer.classList.add("refresh-container");
                setIsLoading(true);
                await fetchData();
                if (onRefresh) {
                    onRefresh().finally(() => {
                        setIsLoading(false);
                        refreshContainer.classList.remove("load-start");
                        refreshContainer.style.marginTop = "0px";
                        spinnerContainer.style.transform = "rotate(0deg)";
                    });
                }
            }
        };

        const swipeStart = (e) => {
            if (!isLoading) {
                let touch = e.targetTouches[0];
                setStartY(touch.screenY);
            }
        };

        const swipe = (e) => {
            if (!isLoading) {
                let touch = e.changedTouches[0];
                let currentY = touch.screenY;

                let changeY = startY < currentY ? Math.abs(startY - currentY) : 0;

                if (refreshContainer && spinnerContainer) {
                    if (changeY <= 80) {
                        refreshContainer.style.marginTop = `${changeY + 50}px`;
                        spinnerContainer.style.transform = `rotate(${changeY * 13.5}deg)`;
                        if (changeY >= 80) loadInit();
                    }
                }
            }
        };

        const swipeEnd = () => {
            if (!isLoading && refreshContainer && spinnerContainer) {
                refreshContainer.style.marginTop = "0px";
                spinnerContainer.style.transform = "rotate(0deg)";
            }
        };

        document.addEventListener("touchstart", swipeStart);
        document.addEventListener("touchmove", swipe);
        document.addEventListener("touchend", swipeEnd);

        return () => {
            document.removeEventListener("touchstart", swipeStart);
            document.removeEventListener("touchmove", swipe);
            document.removeEventListener("touchend", swipeEnd);
        };
    }, [isLoading, startY, onRefresh]);

    return (
        <div>
            <div ref={refreshContainerRef} className="refresh-container">
                <div ref={spinnerContainerRef} className="spinner">
                    <IoIosRefresh style={{fontSize:30}} />
                </div>
            </div>
            {children}
        </div>
    );
};

export default PullToRefresh;
