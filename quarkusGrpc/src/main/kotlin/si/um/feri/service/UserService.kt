package si.um.feri.service

import io.grpc.Status
import io.grpc.stub.StreamObserver
import io.quarkus.grpc.GrpcService
import jakarta.inject.Inject
import org.bson.types.ObjectId
import si.um.feri.User
import si.um.feri.UserServiceGrpc
import si.um.feri.repository.UserRepository

@GrpcService
class UserService : UserServiceGrpc.UserServiceImplBase() {

    @Inject
    lateinit var userRepository: UserRepository

    override fun createUser(request: User.CreateUserRequest, responseObserver: StreamObserver<User.UserResponse>) {
        val user = si.um.feri.model.User(name = request.name, age = request.age)
        userRepository.persist(user)
        // Assuming the ID is generated and assigned by MongoDB upon persisting
        val response = User.UserResponse.newBuilder()
                .setId(user.id?.toHexString() ?: "unknown") // Convert ObjectId to String
                .setName(user.name)
                .setAge(user.age)
                .build()
        responseObserver.onNext(response)
        responseObserver.onCompleted()
    }

    override fun getUser(request: User.GetUserRequest, responseObserver: StreamObserver<User.UserResponse>) {
        try {
            val objectId = ObjectId(request.id) // Convert String to ObjectId
            val user = userRepository.findById(objectId)
            if (user != null) {
                val response = User.UserResponse.newBuilder()
                        .setId(user.id?.toHexString() ?: "unknown") // Convert ObjectId to String
                        .setName(user.name)
                        .setAge(user.age)
                        .build()
                responseObserver.onNext(response)
            } else {
                responseObserver.onError(Status.NOT_FOUND.asRuntimeException())
            }
        } catch (e: IllegalArgumentException) {
            responseObserver.onError(Status.INVALID_ARGUMENT.withDescription("Invalid ID format").asRuntimeException())
        }
        responseObserver.onCompleted()
    }
}
