import React, { useState, useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number) {
	const savedCallback = useRef<() => void>();

	// Escape hatch
	if (delay==0) return;

	// Remember the latest callback.
	useEffect(
		() => {
			savedCallback.current = callback;
		},
		[ callback ]
	);

	// Set up the interval.
	useEffect(
		() => {
			function tick() {
				savedCallback.current();
			}
			if (delay !== null) {
				let id = setInterval(tick, delay);
				return () => clearInterval(id);
			}
		},
		[ delay ]
	);
}
