import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

export default function DoctorSignature({ onSave }) {
    const sigRef = useRef();

    const save = () => {
        if (sigRef.current.isEmpty()) return alert("Draw signature");

        const data = sigRef.current.toDataURL();
        onSave(data);
    };

    return (
        <div>
            <SignatureCanvas
                ref={sigRef}
                canvasProps={{ className: "border w-full h-32" }}
            />

            <button onClick={save}>Save Signature</button>
        </div>
    );
}