package si.um.feri.model

import org.bson.types.ObjectId

@NoArg
data class User(
        var id: ObjectId? = null,
        var name: String,
        var age: Int
)
