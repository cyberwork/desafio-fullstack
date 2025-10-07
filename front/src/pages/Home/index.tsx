import { UserProfile } from '../../components/UserProfile'

export const Home = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-orange-400 text-3xl font-bold mb-8 text-center">
                Desafio para Desenvolvedor - Inmediam
            </h1>
            <UserProfile />
        </div>
    )
}