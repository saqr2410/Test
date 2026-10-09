import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    FileImage,
    ImagePlus,
    Loader2,
    RotateCcw,
    Sparkles,
    Stethoscope,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";

import {
    uploadPrescription,
} from "../../../services/prescriptions/prescriptionService";


const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];


export default function UploadPrescription() {

    const fileInputRef = useRef(null);

    const [
        selectedFile,
        setSelectedFile,
    ] = useState(null);

    const [
        preview,
        setPreview,
    ] = useState(null);

    const [
        analysis,
        setAnalysis,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        isDragging,
        setIsDragging,
    ] = useState(false);


    /* ==========================================
       Cleanup Preview
    ========================================== */

    useEffect(() => {

        return () => {

            if (preview) {

                URL.revokeObjectURL(
                    preview
                );

            }

        };

    }, [preview]);


    /* ==========================================
       Select File
    ========================================== */

    const selectFile = (file) => {

        setError("");
        setAnalysis(null);

        if (!file) {
            return;
        }


        if (!ALLOWED_TYPES.includes(file.type)) {

            setError(
                "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WEBP."
            );

            return;
        }


        if (file.size > MAX_FILE_SIZE) {

            setError(
                "حجم الصورة كبير جدًا. الحد الأقصى المسموح 10 MB."
            );

            return;
        }


        if (preview) {

            URL.revokeObjectURL(
                preview
            );

        }


        const imageUrl =
            URL.createObjectURL(file);


        setSelectedFile(file);
        setPreview(imageUrl);

    };


    /* ==========================================
       Input Change
    ========================================== */

    const handleChange = (event) => {

        const file =
            event.target.files?.[0];

        selectFile(file);

        event.target.value = "";

    };


    /* ==========================================
       Drag & Drop
    ========================================== */

    const handleDragOver = (event) => {

        event.preventDefault();

        setIsDragging(true);

    };


    const handleDragLeave = (event) => {

        event.preventDefault();

        setIsDragging(false);

    };


    const handleDrop = (event) => {

        event.preventDefault();

        setIsDragging(false);

        const file =
            event.dataTransfer.files?.[0];

        selectFile(file);

    };


    /* ==========================================
       Remove File
    ========================================== */

    const removeFile = () => {

        if (preview) {

            URL.revokeObjectURL(
                preview
            );

        }

        setSelectedFile(null);
        setPreview(null);
        setAnalysis(null);
        setError("");

    };


    /* ==========================================
       Analyze Prescription
    ========================================== */

    const handleAnalyze = async () => {

        if (!selectedFile) {

            setError(
                "اختر صورة الروشتة أولاً."
            );

            return;
        }


        try {

            setLoading(true);
            setError("");
            setAnalysis(null);


            const formData =
                new FormData();


            formData.append(
                "image",
                selectedFile
            );


            const result =
                await uploadPrescription(
                    formData
                );


            setAnalysis(
                result
            );


        } catch (requestError) {

            console.error(
                "Prescription Error:",
                requestError
            );


            const backendMessage =
                requestError.response?.data?.detail;


            setError(
                backendMessage ||
                "تعذر تحليل الروشتة. تأكد من وضوح الصورة وحاول مرة أخرى."
            );


        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
       Format File Size
    ========================================== */

    const formatFileSize = (bytes) => {

        if (bytes < 1024) {

            return `${bytes} B`;

        }

        if (bytes < 1024 * 1024) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }

        return `${(
            bytes /
            1024 /
            1024
        ).toFixed(2)} MB`;

    };


    /* ==========================================
       Render
    ========================================== */

    return (

        <div className="
            min-h-screen
            bg-[#F8F5FC]
            py-10
            md:py-16
        ">

            <div className="
                max-w-6xl
                mx-auto
                px-4
                sm:px-6
            ">


                {/* ======================================
                    Main Card
                ====================================== */}

                <div className="
                    bg-white
                    rounded-[28px]
                    md:rounded-[36px]
                    shadow-[0_20px_70px_rgba(91,42,134,0.10)]
                    border
                    border-gray-100
                    overflow-hidden
                ">


                    {/* ==================================
                        Top Purple Header
                    ================================== */}

                    <div className="
                        relative
                        overflow-hidden
                        bg-[#5B2A86]
                        px-6
                        py-7
                        md:px-10
                        md:py-9
                        text-white
                    ">

                        <div className="
                            absolute
                            -top-24
                            -left-20
                            w-64
                            h-64
                            rounded-full
                            bg-white/10
                            blur-2xl
                        " />


                        <div className="
                            absolute
                            -bottom-32
                            -right-20
                            w-72
                            h-72
                            rounded-full
                            bg-purple-300/10
                            blur-3xl
                        " />


                        <div className="
                            relative
                            flex
                            items-center
                            justify-between
                            gap-5
                        ">

                            <div>

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-3
                                ">

                                    <div className="
                                        w-11
                                        h-11
                                        rounded-2xl
                                        bg-white/15
                                        flex
                                        items-center
                                        justify-center
                                    ">

                                        <Stethoscope
                                            size={23}
                                        />

                                    </div>


                                    <span className="
                                        font-bold
                                        text-white/90
                                    ">

                                        المساعد الطبي الذكي

                                    </span>

                                </div>


                                <h2 className="
                                    text-2xl
                                    md:text-3xl
                                    font-black
                                ">

                                    تحليل الروشتة بالذكاء الاصطناعي

                                </h2>


                                <p className="
                                    mt-2
                                    text-white/70
                                    text-sm
                                    md:text-base
                                ">

                                    استخراج الأدوية والتعليمات في ثوانٍ

                                </p>

                            </div>


                            <div className="
                                hidden
                                md:flex
                                w-20
                                h-20
                                rounded-3xl
                                bg-white/10
                                items-center
                                justify-center
                                border
                                border-white/10
                            ">

                                <FileImage
                                    size={38}
                                    className="text-white/90"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        Content
                    ================================== */}

                    <div className="
                        p-5
                        md:p-10
                    ">


                        {/* =================================
                            Loading State
                        ================================= */}

                        {loading ? (

                            <div className="
                                min-h-[420px]
                                flex
                                items-center
                                justify-center
                            ">

                                <div className="
                                    max-w-md
                                    w-full
                                    text-center
                                    px-6
                                ">

                                    <div className="
                                        mx-auto
                                        w-20
                                        h-20
                                        rounded-3xl
                                        bg-[#5B2A86]/10
                                        flex
                                        items-center
                                        justify-center
                                        mb-7
                                    ">

                                        <Loader2
                                            size={38}
                                            className="
                                                text-[#5B2A86]
                                                animate-spin
                                            "
                                        />

                                    </div>


                                    <h3 className="
                                        text-2xl
                                        font-black
                                        text-gray-900
                                    ">

                                        جاري تحليل الروشتة

                                    </h3>


                                    <p className="
                                        mt-3
                                        text-gray-500
                                        leading-7
                                    ">

                                        بنقرأ الأدوية والجرعات
                                        والتعليمات من الصورة.
                                        برجاء الانتظار لحظات...

                                    </p>


                                    <div className="
                                        mt-8
                                        h-2
                                        bg-gray-100
                                        rounded-full
                                        overflow-hidden
                                    ">

                                        <div className="
                                            h-full
                                            w-2/3
                                            bg-[#5B2A86]
                                            rounded-full
                                            animate-pulse
                                        " />

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <>


                                {/* =================================
                                    Error
                                ================================= */}

                                {error && (

                                    <div className="
                                        mb-7
                                        rounded-2xl
                                        border
                                        border-red-100
                                        bg-red-50
                                        p-4
                                        flex
                                        items-start
                                        gap-3
                                        text-red-700
                                    ">

                                        <AlertCircle
                                            size={21}
                                            className="mt-0.5 shrink-0"
                                        />


                                        <p className="
                                            text-sm
                                            leading-6
                                            font-semibold
                                        ">

                                            {error}

                                        </p>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setError("")
                                            }
                                            className="
                                                mr-auto
                                                p-1
                                                rounded-lg
                                                hover:bg-red-100
                                            "
                                        >

                                            <X
                                                size={18}
                                            />

                                        </button>

                                    </div>

                                )}


                                {/* =================================
                                    Upload Area
                                ================================= */}

                                {!selectedFile ? (

                                    <label
                                        onDragOver={
                                            handleDragOver
                                        }
                                        onDragLeave={
                                            handleDragLeave
                                        }
                                        onDrop={
                                            handleDrop
                                        }
                                        className={`

                                            relative
                                            min-h-[330px]
                                            rounded-[28px]
                                            border-2
                                            border-dashed
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            text-center
                                            px-6
                                            cursor-pointer
                                            transition-all
                                            duration-300

                                            ${isDragging
                                                ? `
                                                        border-[#5B2A86]
                                                        bg-[#5B2A86]/10
                                                        scale-[1.01]
                                                    `
                                                : `
                                                        border-gray-200
                                                        bg-gray-50/70
                                                        hover:border-[#5B2A86]/50
                                                        hover:bg-[#F8F5FC]
                                                    `
                                            }

                                        `}
                                    >

                                        <input
                                            ref={
                                                fileInputRef
                                            }
                                            type="file"
                                            hidden
                                            accept="
                                                image/jpeg,
                                                image/png,
                                                image/webp
                                            "
                                            onChange={
                                                handleChange
                                            }
                                        />


                                        <div className="
                                            w-20
                                            h-20
                                            rounded-3xl
                                            bg-[#5B2A86]/10
                                            text-[#5B2A86]
                                            flex
                                            items-center
                                            justify-center
                                            mb-6
                                        ">

                                            {isDragging ? (

                                                <ImagePlus
                                                    size={38}
                                                />

                                            ) : (

                                                <UploadCloud
                                                    size={38}
                                                />

                                            )}

                                        </div>


                                        <h3 className="
                                            text-xl
                                            md:text-2xl
                                            font-black
                                            text-gray-900
                                        ">

                                            {isDragging
                                                ? "ضع الصورة هنا"
                                                : "ارفع صورة الروشتة"
                                            }

                                        </h3>


                                        <p className="
                                            mt-3
                                            text-gray-500
                                            text-sm
                                            md:text-base
                                        ">

                                            اسحب الصورة هنا أو اخترها من جهازك

                                        </p>


                                        <span className="
                                            mt-6
                                            inline-flex
                                            items-center
                                            justify-center
                                            px-7
                                            py-3.5
                                            rounded-xl
                                            bg-[#5B2A86]
                                            text-white
                                            font-bold
                                            shadow-lg
                                            shadow-purple-200
                                            hover:bg-[#472064]
                                            transition
                                        ">

                                            اختيار صورة

                                        </span>


                                        <div className="
                                            mt-6
                                            flex
                                            flex-wrap
                                            items-center
                                            justify-center
                                            gap-x-5
                                            gap-y-2
                                            text-xs
                                            text-gray-400
                                        ">

                                            <span>
                                                JPG
                                            </span>

                                            <span>
                                                PNG
                                            </span>

                                            <span>
                                                WEBP
                                            </span>

                                            <span>
                                                حتى 10 MB
                                            </span>

                                        </div>

                                    </label>

                                ) : (


                                    /* =================================
                                        Selected Image
                                    ================================= */

                                    <div>

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            mb-5
                                        ">

                                            <div>

                                                <h3 className="
                                                    text-xl
                                                    font-black
                                                    text-gray-900
                                                ">

                                                    صورة الروشتة

                                                </h3>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={
                                                    removeFile
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    px-4
                                                    py-2.5
                                                    rounded-xl
                                                    bg-red-50
                                                    text-red-600
                                                    hover:bg-red-100
                                                    font-bold
                                                    text-sm
                                                    transition
                                                "
                                            >

                                                <Trash2
                                                    size={17}
                                                />

                                                إزالة

                                            </button>

                                        </div>


                                        <div className="
                                            rounded-[28px]
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            overflow-hidden
                                        ">

                                            <div className="
                                                min-h-[350px]
                                                md:min-h-[470px]
                                                p-4
                                                md:p-7
                                                flex
                                                items-center
                                                justify-center
                                            ">

                                                {preview && (

                                                    <img
                                                        src={preview}
                                                        alt="صورة الروشتة"
                                                        className="
                                                            max-h-[470px]
                                                            max-w-full
                                                            object-contain
                                                            rounded-2xl
                                                            shadow-lg
                                                            bg-white
                                                        "
                                                    />

                                                )}

                                            </div>


                                            <div className="
                                                border-t
                                                border-gray-200
                                                bg-white
                                                p-5
                                                flex
                                                flex-col
                                                md:flex-row
                                                md:items-center
                                                md:justify-between
                                                gap-4
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    min-w-0
                                                ">

                                                    <div className="
                                                        w-11
                                                        h-11
                                                        rounded-xl
                                                        bg-[#5B2A86]/10
                                                        text-[#5B2A86]
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                    ">

                                                        <FileImage
                                                            size={21}
                                                        />

                                                    </div>


                                                    <div className="min-w-0">

                                                        <p className="
                                                            font-bold
                                                            text-gray-800
                                                            truncate
                                                        ">

                                                            {
                                                                selectedFile.name
                                                            }

                                                        </p>


                                                        <p className="
                                                            text-xs
                                                            text-gray-400
                                                            mt-1
                                                        ">

                                                            {
                                                                formatFileSize(
                                                                    selectedFile.size
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        px-5
                                                        py-3
                                                        rounded-xl
                                                        border
                                                        border-gray-200
                                                        text-gray-700
                                                        hover:border-[#5B2A86]
                                                        hover:text-[#5B2A86]
                                                        font-bold
                                                        transition
                                                    "
                                                >

                                                    <RotateCcw
                                                        size={17}
                                                    />

                                                    تغيير الصورة

                                                </button>


                                                <input
                                                    ref={
                                                        fileInputRef
                                                    }
                                                    type="file"
                                                    hidden
                                                    accept="
                                                        image/jpeg,
                                                        image/png,
                                                        image/webp
                                                    "
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </div>

                                        </div>


                                        {/* =================================
                                            Analyze Button
                                        ================================= */}

                                        <button
                                            type="button"
                                            onClick={
                                                handleAnalyze
                                            }
                                            className="
                                                mt-7
                                                w-full
                                                bg-[#5B2A86]
                                                hover:bg-[#472064]
                                                text-white
                                                rounded-2xl
                                                py-4
                                                md:py-5
                                                text-base
                                                md:text-lg
                                                font-black
                                                flex
                                                items-center
                                                justify-center
                                                gap-3
                                                shadow-xl
                                                shadow-purple-200
                                                hover:shadow-purple-300
                                                transition-all
                                                duration-300
                                                hover:-translate-y-0.5
                                            "
                                        >

                                            <Sparkles
                                                size={21}
                                            />

                                            تحليل الروشتة الآن

                                            <ArrowRight
                                                size={20}
                                            />

                                        </button>

                                    </div>

                                )}


                                {/* =================================
                                    Analysis Result
                                ================================= */}

                                {analysis && (

                                    <div className="
                                        mt-10
                                        pt-10
                                        border-t
                                        border-gray-100
                                    ">


                                        {/* Success */}

                                        <div className="
                                            rounded-3xl
                                            border
                                            border-green-100
                                            bg-green-50
                                            p-5
                                            md:p-6
                                            flex
                                            items-center
                                            gap-4
                                            mb-7
                                        ">

                                            <div className="
                                                w-12
                                                h-12
                                                rounded-2xl
                                                bg-green-100
                                                text-green-600
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                            ">

                                                <CheckCircle2
                                                    size={25}
                                                />

                                            </div>


                                            <div>

                                                <h3 className="
                                                    font-black
                                                    text-green-800
                                                    text-lg
                                                ">

                                                    تم تحليل الروشتة بنجاح

                                                </h3>


                                                <p className="
                                                    text-green-700
                                                    text-sm
                                                    mt-1
                                                    font-bold
                                                ">

                                                    تم استخراج{" "}

                                                    <span className="
                                                        text-green-900
                                                    ">

                                                        {
                                                            analysis.items?.length || 0
                                                        }

                                                    </span>

                                                    {" "}

                                                    {(
                                                        analysis.items?.length || 0
                                                    ) === 1
                                                        ? "دواء"
                                                        : "أدوية"
                                                    }

                                                </p>

                                            </div>

                                        </div>


                                        {/* =================================
                                            Medicines
                                        ================================= */}

                                        <div className="
                                            bg-white
                                            border
                                            border-gray-100
                                            rounded-3xl
                                            overflow-hidden
                                        ">

                                            <div className="
                                                p-6
                                                md:p-8
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                    mb-7
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">

                                                        <div className="
                                                            w-12
                                                            h-12
                                                            rounded-2xl
                                                            bg-[#5B2A86]/10
                                                            text-[#5B2A86]
                                                            flex
                                                            items-center
                                                            justify-center
                                                        ">

                                                            <FileImage
                                                                size={24}
                                                            />

                                                        </div>


                                                        <h2 className="
                                                            text-2xl
                                                            font-black
                                                            text-gray-900
                                                        ">

                                                            الأدوية المستخرجة

                                                        </h2>

                                                    </div>


                                                    <span className="
                                                        px-4
                                                        py-2
                                                        rounded-full
                                                        bg-[#5B2A86]/10
                                                        text-[#5B2A86]
                                                        font-black
                                                        text-sm
                                                    ">

                                                        {
                                                            analysis.items?.length || 0
                                                        }

                                                        {" "}

                                                        {(
                                                            analysis.items?.length || 0
                                                        ) === 1
                                                            ? "دواء"
                                                            : "أدوية"
                                                        }

                                                    </span>

                                                </div>


                                                {analysis.items?.length ? (

                                                    <div className="
                                                        space-y-4
                                                    ">

                                                        {analysis.items.map(
                                                            (item) => (

                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="
                                                                        border
                                                                        border-gray-100
                                                                        rounded-2xl
                                                                        p-5
                                                                        hover:border-[#5B2A86]/20
                                                                        hover:shadow-sm
                                                                        transition
                                                                    "
                                                                >

                                                                    <div className="
                                                                        flex
                                                                        items-start
                                                                        justify-between
                                                                        gap-4
                                                                    ">

                                                                        <div>

                                                                            <h4 className="
                                                                                font-black
                                                                                text-lg
                                                                                text-gray-900
                                                                            ">

                                                                                {
                                                                                    item.raw_name
                                                                                }

                                                                            </h4>


                                                                            <p className="
                                                                                mt-2
                                                                                text-sm
                                                                                text-[#5B2A86]
                                                                                font-bold
                                                                            ">

                                                                                المنتج:

                                                                                {" "}

                                                                                {
                                                                                    item.product_name ||
                                                                                    "غير مطابق"
                                                                                }

                                                                            </p>

                                                                        </div>


                                                                        {item.is_matched ? (

                                                                            <CheckCircle2
                                                                                className="
                                                                                    text-green-600
                                                                                    shrink-0
                                                                                "
                                                                            />

                                                                        ) : (

                                                                            <AlertCircle
                                                                                className="
                                                                                    text-amber-500
                                                                                    shrink-0
                                                                                "
                                                                            />

                                                                        )}

                                                                    </div>


                                                                    <div className="
                                                                        grid
                                                                        grid-cols-1
                                                                        sm:grid-cols-2
                                                                        lg:grid-cols-4
                                                                        gap-3
                                                                        mt-5
                                                                    ">

                                                                        {[
                                                                            [
                                                                                "الجرعة",
                                                                                item.dosage,
                                                                            ],
                                                                            [
                                                                                "التكرار",
                                                                                item.frequency,
                                                                            ],
                                                                            [
                                                                                "المدة",
                                                                                item.duration,
                                                                            ],
                                                                            [
                                                                                "الكمية",
                                                                                item.quantity,
                                                                            ],
                                                                        ].map(
                                                                            ([
                                                                                label,
                                                                                value,
                                                                            ]) => (

                                                                                <div
                                                                                    key={
                                                                                        label
                                                                                    }
                                                                                    className="
                                                                                        rounded-xl
                                                                                        bg-gray-50
                                                                                        p-3
                                                                                    "
                                                                                >

                                                                                    <p className="
                                                                                        text-xs
                                                                                        text-gray-400
                                                                                        mb-1
                                                                                    ">

                                                                                        {
                                                                                            label
                                                                                        }

                                                                                    </p>


                                                                                    <p className="
                                                                                        font-bold
                                                                                        text-gray-800
                                                                                        text-sm
                                                                                    ">

                                                                                        {
                                                                                            value ||
                                                                                            "غير محدد"
                                                                                        }

                                                                                    </p>

                                                                                </div>

                                                                            )
                                                                        )}

                                                                    </div>


                                                                    <div className="
                                                                        mt-5
                                                                    ">

                                                                        <div className="
                                                                            flex
                                                                            items-center
                                                                            justify-between
                                                                            mb-2
                                                                        ">

                                                                            <span className="
                                                                                text-xs
                                                                                font-bold
                                                                                text-gray-500
                                                                            ">

                                                                                نسبة الثقة

                                                                            </span>


                                                                            <span className="
                                                                                text-xs
                                                                                font-black
                                                                                text-[#5B2A86]
                                                                            ">

                                                                                {(
                                                                                    Number(
                                                                                        item.confidence ||
                                                                                        0
                                                                                    ) *
                                                                                    100
                                                                                ).toFixed(
                                                                                    0
                                                                                )}

                                                                                %

                                                                            </span>

                                                                        </div>


                                                                        <div className="
                                                                            h-2
                                                                            rounded-full
                                                                            bg-gray-100
                                                                            overflow-hidden
                                                                        ">

                                                                            <div
                                                                                style={{
                                                                                    width: `${Math.min(
                                                                                        Number(
                                                                                            item.confidence ||
                                                                                            0
                                                                                        ) *
                                                                                        100,
                                                                                        100
                                                                                    )}%`,
                                                                                }}
                                                                                className="
                                                                                    h-full
                                                                                    bg-[#5B2A86]
                                                                                    rounded-full
                                                                                "
                                                                            />

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                ) : (

                                                    <div className="
                                                        rounded-2xl
                                                        border
                                                        border-amber-100
                                                        bg-amber-50
                                                        p-5
                                                        text-amber-700
                                                        font-semibold
                                                    ">

                                                        لم يتم استخراج أي أدوية
                                                        من الروشتة.

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}
