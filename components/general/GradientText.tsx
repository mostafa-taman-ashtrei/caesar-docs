interface props {
    text: string;
}

const GradientText: React.FC<props> = ({ text }) => {
    return (
        <p className="gradient-primary inline-block bg-gradient-to-r bg-clip-text text-transparent">
            {text}
        </p>
    );
};

export default GradientText;
