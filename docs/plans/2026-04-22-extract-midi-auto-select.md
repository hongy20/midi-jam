# Extract MIDI Auto-Select Hook

## Objective

Extract the MIDI input auto-selection logic from `gear-page.client.tsx` into a reusable hook within the `midi-hardware` feature.

## Design and Implementation

1. **Create Hook**: Create `src/features/midi-hardware/hooks/use-midi-auto-select.ts`. This hook will accept `inputs` (array of `MIDIInput`) and a `selectMIDIInput` callback. It will use `useEffect` to attach `midimessage` event listeners to all inputs, triggering the callback when activity is detected.
2. **Export Hook**: Export `useMIDIAutoSelect` from `src/features/midi-hardware/index.ts`.
3. **Refactor Gear Page**: Update `src/app/gear/components/gear-page.client.tsx` to use the new `useMIDIAutoSelect` hook, removing the inline `useEffect`.
4. **Testing**: Add a unit test `use-midi-auto-select.test.ts` to verify the event listeners are attached and the callback is invoked on message.

## Verification

- Run `npm run lint` and `npm run type-check`.
- Run `npm test` to ensure tests pass.
- Verify the auto-select functionality manually if needed.
