import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import Swal from "sweetalert2";

export default function DoctorSignature({ onSave }) {
    const sigRef = useRef();

    const saveSignature = () => {
        if (sigRef.current.isEmpty()) {
            Swal.fire({
                icon: "warning",
                title: "Signature Required",
                text: "Draw signature first ❌",
            });
            return;
        }

        const dataURL = sigRef.current.toDataURL("image/png");
        onSave(dataURL);
    };

    const clear = () => {
        sigRef.current.clear();
        onSave("");
    };

    return (
        <div className="border p-3 rounded">
            <p className="font-semibold mb-2">Doctor Signature</p>

            <SignatureCanvas
                ref={sigRef}
                canvasProps={{
                    className: "border w-full h-40",
                }}
            />

            <div className="flex gap-2 mt-2">
                <button
                    type="button"
                    onClick={saveSignature}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                >
                    Save
                </button>

                <button
                    type="button"
                    onClick={clear}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}