import { getClientsForSelect, getPropertiesForSelect } from "../actions"
import { NewDealForm } from "./form"

export default async function NovaNegociacaoPage() {
    const [clients, properties] = await Promise.all([
        getClientsForSelect(),
        getPropertiesForSelect()
    ])

    return <NewDealForm clients={clients} properties={properties} />
}
