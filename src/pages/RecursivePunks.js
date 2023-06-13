import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecursivePunks.css';
import Header from '../components/Header';

const RecursivePunks = () => {
    const [ids, setIds] = useState(Array(6).fill(''));  // Initialize 4 empty strings
    const labels = ['head', 'mouth/beard', 'earring', 'hat', 'eyes', 'nose'];  // Labels for the fields

    const handleDownload = async () => {
        let svgContent = '<svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">';

        for (let id of ids) {
            if (id === '') continue;  // Skip if the ID field is empty

            svgContent += `\n<image href="/content/${id}" />`;
        }

        svgContent += '\n</svg>\n';

        // Remove extra spaces and tabs from the SVG content but keep newlines

        // Check if the SVG is already taken
        const isTaken = await checkHashAndPost(svgContent);
        console.log(isTaken);
        if (isTaken) {
            alert("already taken");
            return;  // Do not proceed if it's already taken
        }

        const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
        saveAs(blob, "output.svg");

        setIds(Array(6).fill(''));  // Clear all input fields
    }


    const handleInputChange = (index, event) => {
        const values = [...ids];
        values[index] = event.target.value;
        setIds(values);
    }

    async function calculateHash(svgContent) {
        const msgUint8 = new TextEncoder().encode(svgContent);                           // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);              // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer));                        // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');    // convert bytes to hex string
        return hashHex;
    }

    async function checkHashAndPost(svgContent) {
        const hash = await calculateHash(svgContent);

        const params = new URLSearchParams({
            searchAll: "true",
            area: '',
            inscriptionNo: '',
            inscription: '',
            address: '',
            protocol: '',
            text: '',
            hash: hash,
        });

        const fetchResponse = async () => {
            const response = await fetch('https://bitpunks.love:3313/Utility/Inscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else if (!response.headers.get('content-type')?.includes('text/html')) {
                throw new Error('Received unexpected content-type!');
            }

            return response;
        }

        const data = await (fetchResponse().then(response => response.json()));
        console.log(data);

        if (data.length > 0) {
            return true;
        }
        return false;
    }





    return (
        <div>
            <Header />
            <div className="center">
                <h1>recursive punks</h1>
                <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
                    <image href="https://ordiscan.com/content/9d6afbc158e983735e563426981608ea63432619fab468c835322ea30a126c47i0" />
                    <image href="https://ordiscan.com/content/aab67a4269ca0bda649fe341bd88c862aba2e9bf6e0826b9dfa5c4ba8fe62c2di0" />
                    <image href="https://ordiscan.com/content/a01012b213ed425c5d4038bc36016f19f4f342ca052ff9bf6971672164e1a402i0" />
                    <image href="https://ordiscan.com/content/2e171b73b8837b55913b6be6004a9ad78be49778edf1642f826deac67ec7b18ai0" />
                </svg>

                you dont need to fill in each field, just need to be in the right order.
                <p>
                    this will check if it has already been inscribed (NOT INCLUDING SPACES.. COULD HAVE ALREADY BEEN DONE!)
                </p>
                <Link to="https://ordiscan.com/address/bc1p2wrnw6gkyapz67s7ew422z5j9wt442t48day79pe5lv275at5phqlpn9cn">link to assets</Link>
                {ids.map((id, idx) => (
                    <div key={idx}>
                        <label>{labels[idx]}: </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => handleInputChange(idx, e)}
                            placeholder={`Enter inscription id ${idx + 1} here`}
                        />
                    </div>
                ))}
                <button onClick={handleDownload}>Download SVG</button>
            </div>
        </div>
    );
}

export default RecursivePunks;

