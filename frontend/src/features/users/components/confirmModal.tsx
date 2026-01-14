type ConfirmModalProps = {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <>
    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 h-40 max-w-sm w-full shadow-2xl">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </>
);
